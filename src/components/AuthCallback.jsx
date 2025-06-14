import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          // Immediately redirect to home page
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        // Redirect to login page if there's an error
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  // Return null to render nothing
  return null;
}