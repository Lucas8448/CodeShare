import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, DocumentData } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential, linkWithCredential, User, AuthError, AuthCredential, fetchSignInMethodsForEmail } from 'firebase/auth';

interface FirebaseAuthError extends AuthError {
  credential?: AuthCredential;
  email?: string;
}

export interface IUser {
  username: string;
  email: string;
  profilePicUrl?: string;
  bio?: string;
  joinedDate: string;
}

export interface ISnippet {
  title: string;
  description: string;
  code: string;
  language: string;
  createdBy: string;
  createdDate: string;
  updatedDate?: string;
  tags: string[];
  likes: number;
  visibility: 'public' | 'private';
  featured?: boolean;
  starRating?: number;
  versionHistory?: IVersion[];
  forksCount?: number;
  licenseType?: string;
  commentsCount?: number;
}

export interface IVersion {
  version: string;
  date: string;
  changes: string;
}

export interface IComment {
  text: string;
  createdBy: string;
  createdDate: string;
  edited?: boolean;
  likes?: number;
  replyToCommentId?: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyBZfe29hLXyIp2PTg7l3xvpeISKid7jX4c",
  authDomain: "codeshare-99d89.firebaseapp.com",
  projectId: "codeshare-99d89",
  storageBucket: "codeshare-99d89.appspot.com",
  messagingSenderId: "710112511028",
  appId: "1:710112511028:web:27f9946d2add91692cb661",
  measurementId: "G-0C151HPN0F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    console.log('Google sign-in successful:', result.user);
  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    if (firebaseError.code === 'auth/account-exists-with-different-credential' && firebaseError.credential) {
      const pendingCred = firebaseError.credential;
      const email = firebaseError.email;

      if (email) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes('github.com')) {
          const gitHubProvider = new GithubAuthProvider();
          const result = await signInWithPopup(auth, gitHubProvider);
          await linkWithCredential(result.user, pendingCred);
          console.log('Accounts linked: GitHub and Google');
        }
      }
    } else {
      console.error('Error signing in with Google:', firebaseError.message);
    }
  }
};

export const handleGithubSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, new GithubAuthProvider());
    console.log('GitHub sign-in successful:', result.user);
  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    if (firebaseError.code === 'auth/account-exists-with-different-credential' && firebaseError.credential) {
      const pendingCred = firebaseError.credential;
      const email = firebaseError.email;

      if (email) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes('google.com')) {
          const googleProvider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, googleProvider);
          await linkWithCredential(result.user, pendingCred);
          console.log('Accounts linked: Google and GitHub');
        }
      }
    } else {
      console.error('Error signing in with GitHub:', firebaseError.message);
    }
  }
};

export const signUp = async (email: string, password: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = async (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = async (): Promise<void> => signOut(auth);

export const onAuthStateChange = (callback: (user: DocumentData | null) => void) => {
  onAuthStateChanged(auth, callback);
};

export const addSnippet = async (snippet: ISnippet): Promise<DocumentData> => {
  const snippetsCol = collection(db, "snippets");
  return addDoc(snippetsCol, snippet);
};

export const getAllSnippets = async (): Promise<ISnippet[]> => {
  const snippetsCol = collection(db, "snippets");
  const snippetSnapshot = await getDocs(snippetsCol);
  return snippetSnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ISnippet, 'id'>)
  }));
};

export const updateSnippet = async (snippetId: string, updatedData: Partial<ISnippet>): Promise<void> => {
  const snippetDoc = doc(db, "snippets", snippetId);
  return updateDoc(snippetDoc, updatedData);
};

export const deleteSnippet = async (snippetId: string): Promise<void> => {
  const snippetDoc = doc(db, "snippets", snippetId);
  return deleteDoc(snippetDoc);
};

export const addComment = async (snippetId: string, comment: IComment): Promise<DocumentData> => {
  const commentsCol = collection(db, `snippets/${snippetId}/comments`);
  return addDoc(commentsCol, comment);
};

export const getComments = async (snippetId: string): Promise<IComment[]> => {
  const commentsCol = collection(db, `snippets/${snippetId}/comments`);
  const commentSnapshot = await getDocs(commentsCol);
  return commentSnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as IComment)
  }));
};
