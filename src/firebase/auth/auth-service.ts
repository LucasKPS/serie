'use client';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Credentials = {
  email: string;
  password: string;
};

export async function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  credentials: Credentials,
  displayName: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
  
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
    // Even if firestore fails, we don't block the auth flow.
    // The error will be logged for developers.
    console.error("Failed to create user profile in Firestore:", error);
  });
  
  return userCredential;
}

export async function signInWithEmail(auth: Auth, credentials: Credentials): Promise<UserCredential> {
  // This will now throw an error on failure, which will be caught in the UI.
  return signInWithEmailAndPassword(auth, credentials.email, credentials.password);
}
