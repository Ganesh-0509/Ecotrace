// ─────────────────────────────────────────────────────────────────────
// useInsights — orchestrates AI insight generation with Firestore caching.
// ─────────────────────────────────────────────────────────────────────
// To conserve the Gemini free-tier quota, generated insights are cached in
// users/{uid}/insights/{YYYY-MM}. On mount we load the cache (1 read); the
// user explicitly triggers a refresh to spend an API call. This keeps daily
// request volume well within the free RPD limit.
// ─────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuthContext } from '../../../context/AuthContext';
import { currentMonthKey } from '../../../utils/dateUtils';
import { generateInsights, isGeminiConfigured } from '../services/geminiService';

const FRIENDLY_ERRORS = {
  GEMINI_NOT_CONFIGURED: 'AI insights are not configured yet. Add your Gemini API key in .env.',
  EMPTY_RESPONSE: 'The AI returned no recommendations. Please try again.',
  PARSE_ERROR: 'Could not read the AI response. Please try again.',
};

export function useInsights(monthLog) {
  const { user, profile } = useAuthContext();
  const [insights, setInsights] = useState([]);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const configured = isGeminiConfigured();

  const cacheRef = useCallback(
    () => (user ? doc(db, 'users', user.uid, 'insights', currentMonthKey()) : null),
    [user]
  );

  // Load cached insights once.
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const snap = await getDoc(cacheRef());
        if (active && snap.exists()) {
          const data = snap.data();
          setInsights(data.items || []);
          setGeneratedAt(data.generatedAt || null);
        }
      } catch (e) {
        console.warn('Failed to load cached insights:', e.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, cacheRef]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const items = await generateInsights(profile, monthLog);
      const generatedAtIso = new Date().toISOString();
      setInsights(items);
      setGeneratedAt(generatedAtIso);
      // Persist to cache (1 write) so reopening the page costs no API call.
      await setDoc(cacheRef(), { items, generatedAt: generatedAtIso });
    } catch (e) {
      setError(FRIENDLY_ERRORS[e.message] || 'Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, profile, monthLog, cacheRef]);

  return { insights, generatedAt, loading, error, configured, refresh };
}
