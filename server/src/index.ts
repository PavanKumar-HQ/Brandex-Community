import { createApp } from './app.js';
import { config } from './config/env.js';
import { retentionService } from './services/retentionService.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[Brandex Backend & CMS] Server listening on port ${config.port} (${config.nodeEnv})`);

  // Start background 30-day data retention worker
  retentionService.startScheduledWorker();
  console.log('[Retention Service] Automated 30-day data retention worker active.');
});
