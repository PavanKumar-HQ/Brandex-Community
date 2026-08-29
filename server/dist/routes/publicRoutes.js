import { Router } from 'express';
import { contentService } from '../services/contentService.js';
const router = Router();
/**
 * GET /api/public/homepage
 * Returns featured homepage layout items
 */
router.get('/homepage', (req, res) => {
    const config = contentService.getHomepageConfig();
    const featuredEvent = config.featuredEventId ? contentService.getPublicItems('events').find(e => e.id === config.featuredEventId) : null;
    const featuredTraining = config.featuredTrainingId ? contentService.getPublicItems('training').find(t => t.id === config.featuredTrainingId) : null;
    const featuredStory = config.featuredStoryId ? contentService.getPublicItems('stories').find(s => s.id === config.featuredStoryId) : null;
    const radarItems = contentService.getPublicItems('radar');
    res.json({
        success: true,
        data: {
            banner: config.announcementBanner,
            featuredEvent,
            featuredTraining,
            featuredStory,
            radarItems: radarItems.slice(0, 4),
            updatedAt: config.updatedAt
        }
    });
});
/**
 * Generic Public Entity List: GET /api/public/:entity
 * e.g. /api/public/events, /api/public/training, /api/public/workshops, etc.
 */
router.get('/:entity', (req, res) => {
    const { entity } = req.params;
    const category = req.query.category;
    const validEntities = ['events', 'training', 'workshops', 'challenges', 'projects', 'media', 'resources', 'opportunities', 'radar', 'stories'];
    if (!validEntities.includes(entity)) {
        return res.status(404).json({ error: 'NotFound', message: `Entity type '${entity}' does not exist` });
    }
    const items = contentService.getPublicItems(entity, category);
    res.json({
        success: true,
        entity,
        count: items.length,
        data: items
    });
});
/**
 * Single Entity by Slug: GET /api/public/:entity/:slug
 */
router.get('/:entity/:slug', (req, res) => {
    const { entity, slug } = req.params;
    const item = contentService.getPublicItemBySlug(entity, slug);
    if (!item) {
        return res.status(404).json({
            error: 'NotFound',
            message: `No published ${entity} found with slug '${slug}'`
        });
    }
    res.json({
        success: true,
        data: item
    });
});
/**
 * Global Search: GET /api/public/search/query?q=...&type=...
 */
router.get('/search/query', (req, res) => {
    const q = req.query.q || '';
    const type = req.query.type;
    const results = contentService.globalSearch(q, type);
    res.json({
        success: true,
        query: q,
        count: results.length,
        data: results
    });
});
export default router;
