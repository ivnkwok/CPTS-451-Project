import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  // Optionally, store token in a context or secure cookie
  return { user: userCredential.user, token };
};