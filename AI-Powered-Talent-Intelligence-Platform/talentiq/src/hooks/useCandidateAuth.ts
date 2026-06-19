import { useState, useEffect } from 'react';

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  avatar?: string;
}

export function useCandidateAuth() {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/candidate/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.candidate) {
            setCandidate(data.candidate);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/candidate/logout', { method: 'POST' });
      setCandidate(null);
      setIsLoggedIn(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return { candidate, isLoading, isLoggedIn, logout };
}
