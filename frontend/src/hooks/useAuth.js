import { useEffect, useState } from 'react';
import { isAuthenticated, getUsername, subscribeAuth } from '../services/authService';

const readState = () => ({
  authenticated: isAuthenticated(),
  username: getUsername(),
});

const useAuth = () => {
  const [state, setState] = useState(readState);

  useEffect(() => {
    const sync = () => {
      const next = readState();
      setState(prev => (prev.authenticated === next.authenticated && prev.username === next.username ? prev : next));
    };
    sync();
    return subscribeAuth(sync);
  }, []);

  return state;
};

export default useAuth;
