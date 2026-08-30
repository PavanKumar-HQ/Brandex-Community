import { mockStories } from './src/data/mockData';
import { getStoryBySlug, getStories } from './src/repositories/repository';

async function test() {
  const stories = await getStories();
  console.log("Total stories in getStories:", stories.length);
  
  const found = await getStoryBySlug("top-web-development-frameworks-students");
  console.log("Found by slug?", found?.title);
}

test();
