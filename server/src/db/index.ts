import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(dataDir, 'brandex.db');
export const db = new Database(dbPath, { timeout: 10000 });

// Enable WAL mode for high concurrency if file-based
try {
  if (dbPath !== ':memory:') {
    db.pragma('journal_mode = WAL');
  }
} catch (err) {
  // Pragmas may fail safely in multi-threaded concurrent tests
}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      handle TEXT UNIQUE NOT NULL,
      avatar_seed TEXT NOT NULL,
      role TEXT DEFAULT 'Member',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_handle TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT,
      email TEXT,
      organization TEXT,
      domains TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      contributions TEXT NOT NULL,
      focus_areas TEXT,
      project_idea TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Under Review',
      reviewer_notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS service_bookings (
      id TEXT PRIMARY KEY,
      user_handle TEXT NOT NULL,
      service_id TEXT NOT NULL,
      service_title TEXT NOT NULL,
      tier TEXT NOT NULL,
      organization TEXT NOT NULL,
      scope_description TEXT NOT NULL,
      preferred_slot TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Scheduled',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      repo_url TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      stars_count INTEGER DEFAULT 0,
      forks_count INTEGER DEFAULT 0,
      open_issues_count INTEGER DEFAULT 0,
      good_first_issues_count INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contributions (
      id TEXT PRIMARY KEY,
      user_handle TEXT NOT NULL,
      project_id TEXT NOT NULL,
      pr_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Verified',
      points INTEGER DEFAULT 50,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id TEXT PRIMARY KEY,
      user_handle TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      keys TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default open source projects if table is empty
  const projectCount = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (id, title, slug, description, repo_url, tech_stack, stars_count, forks_count, open_issues_count, good_first_issues_count, category, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialProjects = [
      [
        'proj-1',
        'Geniusphere Open Curriculum',
        'geniusphere-open-curriculum',
        'Open-source hardware, robotics, and CS curriculum slide decks, lab sheets, and simulator files.',
        'https://github.com/brandex-hq/geniusphere-curriculum',
        JSON.stringify(['TypeScript', 'Markdown', 'Python', 'Arduino']),
        142,
        38,
        6,
        3,
        'Education',
        1
      ],
      [
        'proj-2',
        'Swiss Editorial Design System',
        'swiss-editorial-ui',
        'Minimalist, high-performance UI component kit adhering to international typographic style and zero neon clutter.',
        'https://github.com/brandex-hq/swiss-editorial-ui',
        JSON.stringify(['React', 'TailwindCSS', 'TypeScript']),
        289,
        54,
        8,
        4,
        'Design Systems',
        1
      ],
      [
        'proj-3',
        'Autonomous Code Audit Agent',
        'code-audit-agent',
        'Local LLM pipeline for scanning ASTs, identifying memory leaks, and generating automated PR test benchmarks.',
        'https://github.com/brandex-hq/code-audit-agent',
        JSON.stringify(['Rust', 'Python', 'Ollama', 'Docker']),
        375,
        81,
        12,
        5,
        'AI & Systems',
        1
      ],
      [
        'proj-4',
        'High-Throughput Key-Value Engine',
        'distributed-kv-engine',
        'LSM-tree based key-value storage engine with Raft consensus and zero-copy networking.',
        'https://github.com/brandex-hq/distributed-kv-engine',
        JSON.stringify(['Go', 'gRPC', 'Protobuf']),
        210,
        43,
        5,
        2,
        'Distributed Systems',
        0
      ]
    ];

    for (const p of initialProjects) {
      insertProject.run(...p);
    }
  }

  // Seed standard sample application for instant verification if empty
  const appCount = (db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number }).count;
  if (appCount === 0) {
    db.prepare(`
      INSERT INTO applications (id, user_handle, type, name, email, organization, domains, experience_level, contributions, focus_areas, project_idea, status, reviewer_notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'BX-2026-8812',
      '@aditya_kernel',
      'cohort',
      'Aditya Vardhan',
      'aditya.v@example.edu',
      'National Institute of Tech',
      JSON.stringify(['AI Engineering Cohort', 'Advanced System Design']),
      'Intermediate',
      JSON.stringify(['Open Source Builder', 'Hackathons & Sprints']),
      JSON.stringify(['Autonomous AI Agents & RAG', 'Distributed Systems & Rust/Go']),
      'Building an autonomous code-review agent with local LLMs and Raft consensus.',
      'Accepted',
      'Application approved by technical admissions board. Onboarding materials dispatched to email.',
      '2026-08-22T10:00:00.000Z'
    );
  }
}
