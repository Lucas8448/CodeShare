import React, { useState, useEffect } from 'react';
import {
  handleGoogleSignIn,
  handleGithubSignIn,
  signUp,
  signIn,
  signOutUser,
  onAuthStateChange,
  addSnippet,
  getAllSnippets,
  updateSnippet,
  deleteSnippet,
  addComment,
  getComments,
  ISnippet,
  IComment,
  IUser
} from './firebase'; // Replace with your actual import path

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Listen for authentication state changes
    onAuthStateChange((user) => setCurrentUser(user as IUser));
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    // Load all snippets from Firebase
    const fetchedSnippets = await getAllSnippets();
    setSnippets(fetchedSnippets);
  };

  const renderSnippets = () => (
    snippets.map(snippet => (
      <div key={snippet.createdBy}>
        <h3>{snippet.title}</h3>
        <p>{snippet.description}</p>
      </div>
    ))
  );

  const handleSignUp = async () => {
    try {
      // Sign up the user with email and password
      await signUp(email, password);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      // Sign in the user with email and password
      await signIn(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div>
      <h1>Code Share Platform</h1>
      {currentUser ? (
        <>
          <button onClick={signOutUser}>Sign Out</button>
          <div>
            <h2>Welcome, {currentUser.email}</h2>
            {/* Add snippet form */}
            <h3>Add a new Snippet</h3>
            <form>
              {/* Form fields for snippet details */}
              {/* You can add input fields here for snippet details */}
              <button type="submit">Add Snippet</button>
            </form>
          </div>
          <div>
            <h2>Your Snippets</h2>
            {/* Render user's snippets */}
            {/* You can call renderSnippets() here */}
          </div>
        </>
      ) : (
        <div>
          {/* Sign In / Sign Up Form */}
          <h2>Sign In</h2>
          <form>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={handleSignIn}>Sign In</button>
            <button type="button" onClick={handleSignUp}>Sign Up</button>
          </form>
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          <button onClick={handleGithubSignIn}>Sign in with GitHub</button>
        </div>
      )}

      <div>
        <h2>All Snippets</h2>
        {/* Render all snippets */}
        {renderSnippets()}
      </div>
    </div>
  );
};

export default App;