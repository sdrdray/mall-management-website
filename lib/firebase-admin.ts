import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';

// Use environment variables for sensitive information
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Initialize Firebase only if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://your-project-id.firebaseio.com',
  });
}

// Example usage: Firestore and Auth
const db = getFirestore();
const auth = getAuth();

// Example usage of Firestore and Auth
async function getUserData(uid: string) {
  try {
    const user = await auth.getUser(uid);
    console.log(user);
    
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      console.log('No such user!');
    } else {
      console.log('User data:', doc.data());
    }
  } catch (error) {
    console.error('Error getting user data:', error);
  }
}
