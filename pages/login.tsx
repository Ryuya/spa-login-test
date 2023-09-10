// pages/login.tsx

import React from 'react';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { app } from '../firebase';

type FormData = {
  email: string;
  password: string;
};

import styles from '../styles/Login.module.css';

const Login = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const auth = getAuth(app);
  const router = useRouter();

  // ユーザーがログインしているかどうかを確認
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // ログインしている場合は Profile ページへリダイレクト
        router.push('/profile');
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onSubmit = (data: FormData) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('ログイン成功:', user);
        router.push('/profile');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert('ログインに失敗しました。メールアドレスかパスワードが間違っています。');
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <input type="email" placeholder="メールアドレス" {...register('email')} />
          <input type="password" placeholder="パスワード" {...register('password')} />
            <span className={styles.small}><a href="/signup">登録がお済みでない方ははこちら</a></span>
          <button className={styles.submitButton} type="submit">ログイン</button>
        </form>
      </div>
      <div className={styles.imageContainer}>
      </div>
    </div>
  );
};

export default Login;
