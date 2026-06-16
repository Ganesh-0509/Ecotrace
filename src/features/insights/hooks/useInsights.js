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
import { generateRuleInsights } from '../services/rulesEngine';

export function useInsights(monthLog) {
  const { user, profile } = useAuthContext();
  const [insights, setInsights] = useState([]);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [source, setSource] = useState(null); // 'gemini' | 'rules'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const geminiReady = isGeminiConfigured();

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
          setSource(data.source || null);
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

    // Smart degradation: prefer Gemini for rich, localized advice; if it is
    // unconfigured or fails for any reason, transparently fall back to the
    // deterministic rule engine so the user ALWAYS gets useful guidance.
    let items = [];
    let usedSource = 'rules';
    if (geminiReady) {
      try {
        items = await generateInsights(profile, monthLog);
        usedSource = 'gemini';
      } catch (e) {
        console.warn('Gemini unavailable, using rule-based coach:', e.message);
        items = generateRuleInsights(profile, monthLog);
        usedSource = 'rules';
      }
    } else {
      items = generateRuleInsights(profile, monthLog);
    }

    try {
      const generatedAtIso = new Date().toISOString();
      setInsights(items);
      setGeneratedAt(generatedAtIso);
      setSource(usedSource);
      // Persist to cache (1 write) so reopening the page costs no API call.
      await setDoc(cacheRef(), { items, generatedAt: generatedAtIso, source: usedSource });
    } catch (e) {
      console.warn('Failed to cache insights:', e.message);
    } finally {
      setLoading(false);
    }
  }, [user, profile, monthLog, cacheRef, geminiReady]);

  return { insights, generatedAt, source, loading, error, geminiReady, refresh };
}
