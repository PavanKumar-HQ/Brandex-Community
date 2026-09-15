/**
 * Pseudo-Anonymous Identity System for Brandex (Discord/Reddit style)
 * Zero real names, phone numbers, or invasive PII stored.
 */

export interface AnonymousIdentity {
  handle: string;
  avatarSeed: string;
  contributorPoints: number;
  createdAt: string;
}

const IDENTITY_KEY = 'brandex_anon_identity';

const ADJECTIVES = ['crypto', 'kernel', 'neural', 'vector', 'distributed', 'swiss', 'quantum', 'matrix', 'agentic', 'cyber'];
const NOUNS = ['builder', 'hacker', 'node', 'daemon', 'architect', 'compiler', 'sprint', 'mesh', 'runner', 'forge'];

export function generateRandomHandle(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `@${adj}_${noun}_${num}`;
}

export function getOrCreateIdentity(): AnonymousIdentity {
  if (typeof window === 'undefined') {
    return {
      handle: '@brandex_builder_101',
      avatarSeed: 'seed_101',
      contributorPoints: 50,
      createdAt: new Date().toISOString()
    };
  }

  const existing = localStorage.getItem(IDENTITY_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // If corrupted, re-generate below
    }
  }

  const newIdentity: AnonymousIdentity = {
    handle: generateRandomHandle(),
    avatarSeed: Math.random().toString(36).substring(2, 10),
    contributorPoints: 50,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(IDENTITY_KEY, JSON.stringify(newIdentity));
  return newIdentity;
}

export function updateIdentityHandle(newHandle: string): AnonymousIdentity {
  const current = getOrCreateIdentity();
  const sanitized = newHandle.startsWith('@') ? newHandle : `@${newHandle}`;
  const updated: AnonymousIdentity = {
    ...current,
    handle: sanitized
  };
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
  return updated;
}

export function addContributorPoints(points: number): number {
  const current = getOrCreateIdentity();
  const updated = {
    ...current,
    contributorPoints: current.contributorPoints + points
  };
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
  return updated.contributorPoints;
}

/**
 * Deterministic SVG Avatar based on avatarSeed (Zero external image dependencies)
 */
export function getIdenticonSvg(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const colors = ['#4338ca', '#6366f1', '#0f172a', '#06b6d4', '#10b981', '#8b5cf6'];
  const color1 = colors[Math.abs(hash) % colors.length];
  const color2 = colors[Math.abs(hash >> 3) % colors.length];

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><rect width="40" height="40" rx="12" fill="${color1}"/><circle cx="20" cy="16" r="8" fill="${color2}"/><path d="M10 34c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="${color2}"/></svg>`;
}
