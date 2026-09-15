import { openDB, DBSchema } from 'idb';

interface BrandexPwaDB extends DBSchema {
  offline_queue: {
    key: string;
    value: {
      id: string;
      type: 'booking' | 'application' | 'pr_claim';
      endpoint: string;
      payload: any;
      timestamp: string;
    };
  };
  cached_notes: {
    key: string;
    value: {
      slug: string;
      title: string;
      content: string;
      updatedAt: string;
    };
  };
}

const DB_NAME = 'brandex_pwa_db';
const DB_VERSION = 1;

export async function getDb() {
  return openDB<BrandexPwaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('offline_queue')) {
        db.createObjectStore('offline_queue', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cached_notes')) {
        db.createObjectStore('cached_notes', { keyPath: 'slug' });
      }
    },
  });
}

/**
 * Queue an action while offline to be synced when internet connectivity resumes
 */
export async function queueOfflineAction(
  type: 'booking' | 'application' | 'pr_claim',
  endpoint: string,
  payload: any
): Promise<string> {
  const db = await getDb();
  const id = `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const item = {
    id,
    type,
    endpoint,
    payload,
    timestamp: new Date().toISOString(),
  };

  await db.put('offline_queue', item);
  return id;
}

/**
 * Get all pending actions in offline queue
 */
export async function getPendingQueue() {
  const db = await getDb();
  return db.getAll('offline_queue');
}

/**
 * Sync all queued actions with the backend server
 */
export async function syncOfflineQueue(): Promise<{ synced: number; failed: number }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const db = await getDb();
  const queue = await db.getAll('offline_queue');
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const res = await fetch(item.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });

      if (res.ok) {
        await db.delete('offline_queue', item.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}

/**
 * Save and cache a syllabus note for offline reading
 */
export async function cacheLearningNote(slug: string, title: string, content: string) {
  const db = await getDb();
  await db.put('cached_notes', {
    slug,
    title,
    content,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCachedLearningNote(slug: string) {
  const db = await getDb();
  return db.get('cached_notes', slug);
}
