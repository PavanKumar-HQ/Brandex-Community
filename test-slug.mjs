import { mockStories } from './src/data/mockData.js';

console.log("Total mock stories:", mockStories.length);
const found = mockStories.find(s => s.slug === 'top-web-development-frameworks-students');
console.log("Found sto-9 by slug?", !!found);
