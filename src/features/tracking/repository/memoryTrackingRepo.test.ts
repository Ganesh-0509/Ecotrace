// Validates the tracking repository contract against the in-memory backend.
// The production Firestore backend is the same shape, so these aggregation
// rules are the rules both implementations must honour.
import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryTrackingRepo } from './memoryTrackingRepo';
import type { ActionCategory, LogEntry } from '../../../domain/models';
import type { TrackingRepo } from './index';

const entry = (co2SavedKg: number, category: ActionCategory = 'transport'): LogEntry => ({
  actionId: 'transit_commute',
  label: 'Took public transit',
  category,
  co2SavedKg,
  note: '',
  loggedAt: '2026-06-15T09:00:00.000Z',
});

describe('memory tracking repository', () => {
  let repo: TrackingRepo;
  beforeEach(() => {
    repo = createMemoryTrackingRepo();
  });

  it('returns a safe empty month before anything is logged', async () => {
    const log = await repo.getMonthLog('u1', '2026-06');
    expect(log).toEqual({ month: '2026-06', entries: [], totalSaved: 0, count: 0 });
  });

  it('creates the month document on the first log', async () => {
    await repo.appendLog('u1', '2026-06', entry(2.6));
    const log = await repo.getMonthLog('u1', '2026-06');
    expect(log.count).toBe(1);
    expect(log.totalSaved).toBe(2.6);
    expect(log.entries).toHaveLength(1);
  });

  it('aggregates subsequent logs into the same document', async () => {
    await repo.appendLog('u1', '2026-06', entry(2.6));
    await repo.appendLog('u1', '2026-06', entry(1.4));
    const log = await repo.getMonthLog('u1', '2026-06');
    expect(log.count).toBe(2);
    expect(log.totalSaved).toBe(4); // 2.6 + 1.4, rounded to 2dp
  });

  it('keeps months and users isolated', async () => {
    await repo.appendLog('u1', '2026-06', entry(2.6));
    expect((await repo.getMonthLog('u1', '2026-07')).count).toBe(0);
    expect((await repo.getMonthLog('u2', '2026-06')).count).toBe(0);
  });

  it('saves a profile and marks it complete', async () => {
    await repo.saveProfile('u1', { city: 'Pune', transport: 'car' });
    const profile = await repo.getProfile('u1');
    expect(profile).toMatchObject({ city: 'Pune', transport: 'car', profileCompleted: true });
  });

  it('updates profile fields without flipping completion state', async () => {
    await repo.saveProfile('u1', { city: 'Pune' });
    await repo.updateProfileFields('u1', { city: 'Mumbai' });
    const profile = await repo.getProfile('u1');
    expect(profile?.city).toBe('Mumbai');
    expect(profile?.profileCompleted).toBe(true);
  });
});
