
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import './App.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <div className="auth-container">
        <h1>🔐 Firebase Auth Demo</h1>

        {!user ? (
          <div className="login-section">
            <p>Sign in with your Google account</p>
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="google-btn"
            >
              {loading ? 'Signing in...' : '🔍 Sign in with Google'}
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        ) : (
          <div className="user-section">
            <img src={user.photoURL} alt="Avatar" className="avatar" />
            <h2>Welcome, {user.displayName}!</h2>
            <p>{user.email}</p>
            <button onClick={handleSignOut} className="signout-btn">
              Sign Out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
