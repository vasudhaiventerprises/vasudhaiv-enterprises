import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null;
  try {
    const messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error("Firebase messaging not supported:", error);
    return null;
  }
};

export const requestNotificationPermission = async (userId: string) => {
  if (typeof window === 'undefined') return;

  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      
      if (currentToken) {
        // Here you would call an API or Supabase client to save the token to the profile
        console.log("FCM Token:", currentToken);
        return currentToken;
      }
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};
