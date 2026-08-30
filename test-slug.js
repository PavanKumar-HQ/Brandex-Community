const fs = require('fs');
const content = fs.readFileSync('src/data/mockData.ts', 'utf8');
const match = content.match(/mockStories: Story\[\] = \[([\s\S]*?)\];/);
if (match) {
  console.log("Mock stories block found.");
  // Check if sto-28 is in it
  console.log("Has sto-28?", content.includes("sto-28"));
}
