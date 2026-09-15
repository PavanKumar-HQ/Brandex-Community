/**
 * Pseudo-Anonymous Identity System for Brandex (Discord/Reddit style)
 * Zero real names, phone numbers, or invasive PII stored.
 */

export interface AnonymousIdentity {
  handle: string;
  avatarSeed: string;
  contributorPoints: number;
  createdAt: string;
  isRegistered?: boolean;
  displayName?: string;
  domain?: string;
}

export interface AvatarPreset {
  id: string;
  name: string;
  tagline: string;
  seed: string;
  svgDataUri: string;
}

const IDENTITY_KEY = 'brandex_anon_identity';
const REGISTERED_KEY = 'brandex_user_registered';

const ADJECTIVES = ['crypto', 'kernel', 'neural', 'vector', 'distributed', 'swiss', 'quantum', 'matrix', 'agentic', 'cyber'];
const NOUNS = ['builder', 'hacker', 'node', 'daemon', 'architect', 'compiler', 'sprint', 'mesh', 'runner', 'forge'];

function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'avatar-cyber-sentinel',
    name: 'Cyber Sentinel',
    tagline: 'Defensive Architecture & Node Security',
    seed: 'avatar-cyber-sentinel',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="28" fill="#090d16"/>
        <circle cx="50" cy="50" r="36" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="6 3" fill="none" opacity="0.5"/>
        <circle cx="50" cy="50" r="26" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="2"/>
        <rect x="28" y="44" width="44" height="12" rx="6" fill="#06b6d4"/>
        <circle cx="42" cy="50" r="3.5" fill="#ffffff"/>
        <circle cx="58" cy="50" r="3.5" fill="#ffffff"/>
        <path d="M50 18 L50 26 M50 74 L50 82 M18 50 L26 50 M74 50 L82 50" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="50" cy="18" r="2" fill="#38bdf8"/>
        <circle cx="82" cy="50" r="2" fill="#38bdf8"/>
      </svg>
    `.trim())
  },
  {
    id: 'avatar-neural-architect',
    name: 'Neural Architect',
    tagline: 'Autonomous Agents & Cognitive Models',
    seed: 'avatar-neural-architect',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="28" fill="#1e1b4b"/>
        <path d="M50 24 L28 46 L36 74 L64 74 L72 46 Z" fill="#4338ca" fill-opacity="0.25" stroke="#818cf8" stroke-width="2"/>
        <path d="M50 24 L50 50 M28 46 L50 50 M72 46 L50 50 M36 74 L50 50 M64 74 L50 50" stroke="#a5b4fc" stroke-width="1.5" stroke-dasharray="3 2"/>
        <circle cx="50" cy="50" r="9" fill="#8b5cf6"/>
        <circle cx="50" cy="24" r="5" fill="#c084fc"/>
        <circle cx="28" cy="46" r="5" fill="#818cf8"/>
        <circle cx="72" cy="46" r="5" fill="#818cf8"/>
        <circle cx="36" cy="74" r="5" fill="#c084fc"/>
        <circle cx="64" cy="74" r="5" fill="#c084fc"/>
        <circle cx="50" cy="50" r="3.5" fill="#ffffff"/>
      </svg>
    `.trim())
  },
  {
    id: 'avatar-swiss-minimalist',
    name: 'Swiss Minimalist',
    tagline: 'Bauhaus Precision & Modernist Systems',
    seed: 'avatar-swiss-minimalist',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="28" fill="#18181b"/>
        <circle cx="50" cy="50" r="33" stroke="#52525b" stroke-width="1.5" fill="none"/>
        <line x1="16" y1="50" x2="84" y2="50" stroke="#3f3f46" stroke-width="1.5"/>
        <line x1="50" y1="16" x2="50" y2="84" stroke="#3f3f46" stroke-width="1.5"/>
        <rect x="34" y="34" width="32" height="32" fill="#f43f5e" rx="4"/>
        <circle cx="50" cy="50" r="8" fill="#ffffff"/>
        <circle cx="50" cy="22" r="3" fill="#f43f5e"/>
        <circle cx="78" cy="50" r="3" fill="#f43f5e"/>
        <circle cx="50" cy="78" r="3" fill="#f43f5e"/>
        <circle cx="22" cy="50" r="3" fill="#f43f5e"/>
      </svg>
    `.trim())
  },
  {
    id: 'avatar-quantum-core',
    name: 'Quantum Core',
    tagline: 'Distributed Matrix & Consensus Nodes',
    seed: 'avatar-quantum-core',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="28" fill="#022c22"/>
        <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#34d399" stroke-width="2" fill="none" transform="rotate(-30 50 50)"/>
        <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#2dd4bf" stroke-width="2" fill="none" transform="rotate(30 50 50)"/>
        <circle cx="50" cy="50" r="14" fill="#059669"/>
        <circle cx="50" cy="50" r="8" fill="#10b981"/>
        <circle cx="50" cy="50" r="3.5" fill="#ffffff"/>
        <circle cx="25" cy="36" r="3.5" fill="#6ee7b7"/>
        <circle cx="75" cy="64" r="3.5" fill="#6ee7b7"/>
      </svg>
    `.trim())
  },
  {
    id: 'avatar-apex-builder',
    name: 'Apex Builder',
    tagline: 'Full-Stack Engineering & Cloud Infrastructure',
    seed: 'avatar-apex-builder',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="28" fill="#1c1917"/>
        <path d="M50 18 L80 35 L80 69 L50 86 L20 69 L20 35 Z" fill="#292524" stroke="#f59e0b" stroke-width="2"/>
        <path d="M50 18 L80 35 L50 52 L20 35 Z" fill="#d97706"/>
        <path d="M20 35 L50 52 L50 86 L20 69 Z" fill="#b45309"/>
        <path d="M80 35 L50 52 L50 86 L80 69 Z" fill="#f59e0b"/>
        <circle cx="50" cy="52" r="5" fill="#fef3c7"/>
      </svg>
    `.trim())
  }
];

export function getAvatarPreset(seedOrId?: string): AvatarPreset {
  if (!seedOrId) return AVATAR_PRESETS[0];
  const found = AVATAR_PRESETS.find(p => p.id === seedOrId || p.seed === seedOrId);
  return found || AVATAR_PRESETS[0];
}

export function generateRandomHandle(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `@${adj}_${noun}_${num}`;
}

export function isUserRegistered(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(REGISTERED_KEY) === 'true';
}

export function registerUserAccount(
  handle?: string,
  avatarSeed?: string,
  displayName?: string,
  domain?: string
): AnonymousIdentity {
  const current = getOrCreateIdentity();
  const finalHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : current.handle;
  const finalAvatar = avatarSeed || current.avatarSeed || AVATAR_PRESETS[0].id;

  const updated: AnonymousIdentity = {
    ...current,
    handle: finalHandle,
    avatarSeed: finalAvatar,
    displayName: displayName || current.displayName,
    domain: domain || current.domain,
    isRegistered: true,
    contributorPoints: Math.max(current.contributorPoints, 150)
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
    localStorage.setItem(REGISTERED_KEY, 'true');
  }
  return updated;
}

export function getOrCreateIdentity(): AnonymousIdentity {
  if (typeof window === 'undefined') {
    return {
      handle: '@brandex_builder_101',
      avatarSeed: AVATAR_PRESETS[0].id,
      contributorPoints: 50,
      createdAt: new Date().toISOString(),
      isRegistered: false
    };
  }

  const registeredFlag = localStorage.getItem(REGISTERED_KEY) === 'true';
  const existing = localStorage.getItem(IDENTITY_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      return {
        ...parsed,
        isRegistered: registeredFlag || Boolean(parsed.isRegistered)
      };
    } catch {
      // If corrupted, re-generate below
    }
  }

  const newIdentity: AnonymousIdentity = {
    handle: generateRandomHandle(),
    avatarSeed: AVATAR_PRESETS[0].id,
    contributorPoints: 50,
    createdAt: new Date().toISOString(),
    isRegistered: false
  };

  localStorage.setItem(IDENTITY_KEY, JSON.stringify(newIdentity));
  return newIdentity;
}

export function updateIdentityHandle(newHandle: string): AnonymousIdentity {
  const current = getOrCreateIdentity();
  const sanitized = newHandle.startsWith('@') ? newHandle : `@${newHandle}`;
  const updated: AnonymousIdentity = {
    ...current,
    handle: sanitized,
    isRegistered: true
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
    localStorage.setItem(REGISTERED_KEY, 'true');
  }
  return updated;
}

export function updateIdentityAvatar(avatarSeed: string): AnonymousIdentity {
  const current = getOrCreateIdentity();
  const updated: AnonymousIdentity = {
    ...current,
    avatarSeed
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
  }
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
 * Deterministic or Curated Vector SVG Avatar (Zero external image dependencies)
 */
export function getIdenticonSvg(seed: string): string {
  if (!seed) return AVATAR_PRESETS[0].svgDataUri;

  // 1. Check if seed corresponds to one of the 5 curated vector presets
  const preset = AVATAR_PRESETS.find(p => p.id === seed || p.seed === seed);
  if (preset) {
    return preset.svgDataUri;
  }

  // 2. Deterministic fallback for older custom seeds
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const colors = ['#4338ca', '#6366f1', '#0f172a', '#06b6d4', '#10b981', '#8b5cf6'];
  const color1 = colors[Math.abs(hash) % colors.length];
  const color2 = colors[Math.abs(hash >> 3) % colors.length];

  return createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <rect width="40" height="40" rx="12" fill="${color1}"/>
      <circle cx="20" cy="16" r="8" fill="${color2}"/>
      <path d="M10 34c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="${color2}"/>
    </svg>
  `.trim());
}
