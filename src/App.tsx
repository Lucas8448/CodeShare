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
} from './firebase'; // Update the import path as needed

interface NewSnippetState {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  visibility: 'public' | 'private';
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [newSnippet, setNewSnippet] = useState<NewSnippetState>({ title: '', description: '', code: '', language: '', tags: [], visibility: 'public' });
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authMessage, setAuthMessage] = useState<string>('');

  useEffect(() => {
    onAuthStateChange((user) => setCurrentUser(user as IUser));
    loadSnippets();
  }, []);

  const loadSnippets = async (): Promise<void> => {
    const fetchedSnippets = await getAllSnippets();
    setSnippets(fetchedSnippets);
  };

  const handleAddSnippet = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      await addSnippet({ ...newSnippet, createdBy: currentUser?.email || '', createdDate: new Date().toISOString(), likes: 0 });
      setNewSnippet({ title: '', description: '', code: '', language: '', tags: [], visibility: 'public' });
      loadSnippets();
    } catch (error) {
      console.error('Error adding snippet:', error);
    }
  };

  const handleDeleteSnippet = async (snippetId: string): Promise<void> => {
    try {
      await deleteSnippet(snippetId);
      loadSnippets();
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  const renderSnippets = (): JSX.Element[] => (
    snippets.map((snippet: ISnippet) => (
      <div key={snippet.title}>
        <h3>{snippet.title}</h3>
        <p>{snippet.description}</p>
        {/* Additional snippet details */}
        {currentUser?.email === snippet.createdBy && (
          <>
            <button onClick={() => handleDeleteSnippet(snippet.title)}>Delete</button>
            {/* Add update functionality */}
          </>
        )}
      </div>
    ))
  );

  const handleSignUp = async (): Promise<void> => {
    try {
      await signUp(email, password);
      setAuthMessage('Sign up successful');
    } catch (error) {
      setAuthMessage(`Error signing up: ${error}`);
    }
  };

  const handleSignIn = async (): Promise<void> => {
    try {
      await signIn(email, password);
      setAuthMessage('Sign in successful');
    } catch (error) {
      setAuthMessage(`Error signing in: ${error}`);
    }
  };

  return (
    <div>
      <h1>Code Share Platform</h1>
      {authMessage && <p>{authMessage}</p>}
      {currentUser ? (
        <>
          <button onClick={signOutUser}>Sign Out</button>
          <div>
            <h2>Welcome, {currentUser.email}</h2>
            <h3>Add a new Snippet</h3>
            <form onSubmit={handleAddSnippet}>
              <input type="text" placeholder="Title" value={newSnippet.title} onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })} />
              <textarea placeholder="Description" value={newSnippet.description} onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })} />
              <textarea placeholder="Code" value={newSnippet.code} onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })} />
              {/* Additional fields */}
              <button type="submit">Add Snippet</button>
            </form>
          </div>
          <div>
            <h2>Your Snippets</h2>
            {renderSnippets()}
          </div>
        </>
      ) : (
        <div>
          <h2>Sign In</h2>
          <form>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={handleSignIn}>Sign In</button>
            <button type="button" onClick={handleSignUp}>Sign Up</button>
          </form>
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          <button onClick={handleGithubSignIn}>Sign in with GitHub</button>
        </div>
      )}
      <div>
        <h2>All Snippets</h2>
        {renderSnippets()}
      </div>
    </div>
  );
};

export default App;