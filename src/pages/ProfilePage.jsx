// ─────────────────────────────────────────────────────────────────────
// ProfilePage — view and edit the baseline profile that personalises
// savings and AI coaching.
// ─────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import toast from 'react-hot-toast';
import Field from '../components/Field';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuthContext } from '../context/AuthContext';
import { updateProfileFields } from '../features/tracking/services/trackingService';
import { TRANSPORT_MODES, DIET_TYPES, ENERGY_SOURCES } from '../domain/models';

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

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthContext();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: profile?.displayName || '',
    city: profile?.city || '',
    transport: profile?.transport || TRANSPORT_MODES.CAR,
    diet: profile?.diet || DIET_TYPES.BALANCED,
    energy: profile?.energy || ENERGY_SOURCES.GRID,
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateProfileFields(user.uid, { ...form, city: form.city.trim() });
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <h1 className="section-title">
        <span aria-hidden="true">👤</span> Your profile
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field id="displayName" label="Name" value={form.displayName} onChange={update('displayName')} />
          <Field id="city" label="City / region" value={form.city} onChange={update('city')} required />
          <Field
            id="transport"
            label="Primary transport"
            options={TRANSPORT_OPTIONS}
            value={form.transport}
            onChange={update('transport')}
          />
          <Field id="diet" label="Typical diet" options={DIET_OPTIONS} value={form.diet} onChange={update('diet')} />
          <Field
            id="energy"
            label="Home energy source"
            options={ENERGY_OPTIONS}
            value={form.energy}
            onChange={update('energy')}
          />
          <Button type="submit" loading={saving} className="w-full mt-1">
            Save changes
          </Button>
        </form>
      </Card>

      <p className="text-center text-xs text-[var(--color-text-muted)]">
        Signed in as {user?.email}
      </p>
    </div>
  );
}
