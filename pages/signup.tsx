import { app } from "../firebase";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';


type FormData = {
  username: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  terms: boolean;
};

const Signup = () => {
    const [image, setImage] = useState<File | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const auth = getAuth(app);
    const router = useRouter();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setImage(file);
    };
  
    const handleUpload = async (uid: string) => {
      const storage = getStorage();
      const storageRef = ref(storage, 'profilePictures/' + uid);
  
      await uploadBytes(storageRef, image as Blob).then((snapshot) => {
        return getDownloadURL(storageRef);
      }).then((downloadURL) => {
        return updateProfile(auth.currentUser, {
          photoURL: downloadURL
        });
      });
    };
  
    const onSubmit = (data: FormData) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
          .then(async (userCredential) => {
            const db = getFirestore(); // Firestoreのインスタンスを取得
            const uid = userCredential.user.uid; // ユーザーのUIDを取得
      
            await handleUpload(uid);  // 画像のアップロード
      
            // Firestoreにその他のユーザー情報を保存
            const userDoc = doc(db, 'users', uid);
            await setDoc(userDoc, {
              username: data.username,
              email: data.email,
              dob: data.dob,
              gender: data.gender
            });
      
            console.log('登録成功:', userCredential.user);
            router.push('/profile');
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // エラーコードによっては、特定のアクションを取る
            if (errorCode === 'auth/email-already-in-use') {
            alert('このメールアドレスは既に使用されています。');
            } else {
            console.log('登録失敗:', errorCode, errorMessage);
            }
          });
      };
  
    return (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <label>
            ユーザー名:
            <input type="text" {...register('username', { required: 'この項目は必須です' })} />
            {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
          </label>
        <label>
            メールアドレス:
            <input type="email" {...register('email',{ required: 'この項目は必須です' })} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </label>
        <label>
            パスワード:
            <input type="password" {...register('password',{ required: 'この項目は必須です' })} />
            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </label>
        <label>
            生年月日:
            <input type="date" {...register('dob',{ required: 'この項目は必須です' })} />
            {errors.dob && <p style={{ color: 'red' }}>{errors.dob.message}</p>}
        </label>
        <label>
            性別:
            <select {...register('gender',{required : true})}>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
            </select>
        </label>
        <label>
            プロフィール画像:
            <input type="file" onChange={handleChange} />
        </label>
        
        <label>
            利用規約に同意する
            <input type="checkbox" {...register('terms',{required : true})} />
            <a href="https://www.notion.so/457df49475494671807673a0a3346451?pvs=21" target="_blank" rel="noreferrer">
            利用規約
            </a>
        </label>
        <p>{errors.terms && <p style={{ color: 'red' }}>利用規約に同意する必要があります</p>}</p>
        <span className={styles.small}>すでにアカウントをお持ちの方は<a href="/login">ログイン</a></span>
        <button type="submit">登録</button>
        
        </form>
        
        </div>
        <div className={styles.imageContainer}>
      </div>
    </div>
  );
};

export default Signup;
