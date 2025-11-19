'use client';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Credentials = {
  email: string;
  password: string;
};

// This function is non-blocking.
export function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  credentials: Credentials,
  displayName: string
) {
  createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then((userCredential) => {
      // After user is created in Auth, create user profile in Firestore
      const user = userCredential.user;
      const userProfile = {
        id: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(),
      };
      const userDocRef = doc(firestore, 'users', user.uid);

      // Set document in a non-blocking way
      setDoc(userDocRef, userProfile).catch((error) => {
        // Emit a contextual error if Firestore write fails
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userProfile,
          })
        );
      });
    })
    .catch((error) => {
      // The onAuthStateChanged listener will handle the UI state.
      // You might want to log this for debugging, but don't show it to the user
      // unless it's a specific, user-actionable error.
      console.error('Error during sign up:', error);
    });
}

// This function is non-blocking.
export function signInWithEmail(auth: Auth, credentials: Credentials) {
  signInWithEmailAndPassword(auth, credentials.email, credentials.password).catch(
    (error) => {
      // Similar to sign-up, let onAuthStateChanged handle global state.
      // You could show a toast for "invalid-credential" here if desired.
      console.error('Error during sign in:', error);
    }
  );
}

    