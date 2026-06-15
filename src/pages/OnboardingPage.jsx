// ─────────────────────────────────────────────────────────────────────
// OnboardingPage — captures the baseline carbon profile. Stored once at
// users/{uid}; becomes the context every AI insight request builds upon.
// ─────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuthContext } from '../context/AuthContext';
import { saveProfile } from '../features/tracking/services/trackingService';
import {
  TRANSPORT_MODES,
  DIET_TYPES,
  ENERGY_SOURCES,
} from '../domain/models';

const TRANSPORT_OPTIONS = [
  { value: TRANSPORT_MODES.CAR, label: 'Car (petrol/diesel)' },
  { value: TRANSPORT_MODES.EV, label: 'Electric vehicle' },
  { value: TRANSPORT_MODES.TRANSIT, label: 'Public transit' },
  { value: TRANSPORT_MODES.BIKE, label: 'Bike / walk' },
];
const DIET_OPTIONS = [
  { value: DIET_TYPES.MEAT_HEAVY, label: 'Meat with most meals' },
  { value: DIET_TYPES.BALANCED, label: 'Balanced / flexitarian' },
  { value: DIET_TYPES.PLANT_BASED, label: 'Mostly plant-based' },
];
const ENERGY_OPTIONS = [
  { value: ENERGY_SOURCES.GRID, label: 'Standard grid' },
  { value: ENERGY_SOURCES.MIXED, label: 'Mixed / partial renewable' },
  { value: ENERGY_SOURCES.RENEWABLE, label: 'Mostly renewable' },
];

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuthContext();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    city: '',
    transport: TRANSPORT_MODES.CAR,
    diet: DIET_TYPES.BALANCED,
    energy: ENERGY_SOURCES.GRID,
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await saveProfile(user.uid, { ...form, city: form.city.trim() });
      await refreshProfile();
      toast.success('Profile saved — let’s start tracking!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] bg-grid flex items-center justify-center px-4 py-10">
      <div className="glass-card-static w-full max-w-lg p-7">
        <h1 className="text-xl font-bold">Set your baseline</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-6">
          A few quick questions so EcoTrace can personalise your savings and AI coaching. You can
          change these anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            id="city"
            label="Your city / region"
            value={form.city}
            onChange={update('city')}
            placeholder="e.g. Chennai, India"
            required
          />
          <Field
            id="transport"
            label="Primary transport"
            options={TRANSPORT_OPTIONS}
            value={form.transport}
            onChange={update('transport')}
          />
          <Field
            id="diet"
            label="Typical diet"
            options={DIET_OPTIONS}
            value={form.diet}
            onChange={update('diet')}
          />
          <Field
            id="energy"
            label="Home energy source"
            options={ENERGY_OPTIONS}
            value={form.energy}
            onChange={update('energy')}
          />
          <Button type="submit" loading={saving} className="w-full mt-2">
            Start tracking
          </Button>
        </form>
      </div>
    </div>
  );
}
