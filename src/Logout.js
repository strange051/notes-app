// Logout.js

import { auth } from './firebase';
import { signOut } from 'firebase/auth';

function Logout() {
  const handleLogout = async () => {
    await signOut(auth);
    // User signed out
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
