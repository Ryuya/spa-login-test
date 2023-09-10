import React, { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from '../components/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const Profile = () => {
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const auth = getAuth();
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const storage = getStorage(app);
      const imagePath = `profilePictures/${auth.currentUser?.uid}`;
      const imageRef = ref(storage, imagePath);
      

      try {
        const url = await getDownloadURL(imageRef);
        setProfileImageURL(url);
      } catch (error) {
        console.log('Error getting profile image:', error);
      }
    };

    if (auth.currentUser?.uid) {
      fetchProfileImage();
    }

    // Firestoreからプロフィール情報を取得
    const fetchProfileInfo = async () => {
        if (auth.currentUser?.uid) {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setProfileInfo(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      };
  
    fetchProfileInfo();

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/signup');
      }
    });
    }, [auth.currentUser]);

  return (
    <div>
    <Header />
    <div className={styles.profileContainer}>
      <h1>Your Profile</h1>
      {profileImageURL ? (
       <div className={styles.profileImageContainer}>
    <img src={profileImageURL} alt="プロフィール画像" className={styles.profileImage} />
    </div>
      ) : (
        <p>No profile image uploaded</p>
      )}
        <p>ユーザー名: {profileInfo?.username}</p>  
        <p>メールアドレス: {profileInfo?.email}</p>
        <p>生年月日: {profileInfo?.dob}</p>
        
    </div>
    </div>
  );
};

export default Profile;

