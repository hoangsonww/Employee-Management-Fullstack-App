import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// One-shot redirect instead of <Navigate>. React Router's <Navigate> re-fires
// its redirect on every render (its effect has no dependency array); when an
// outgoing page is kept mounted during a page transition that produced an
// infinite history.replace() loop. A guarded effect fires the redirect once.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!authenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [authenticated, navigate, location.pathname]);

  if (!authenticated) return null;
  return children;
};

export default ProtectedRoute;
