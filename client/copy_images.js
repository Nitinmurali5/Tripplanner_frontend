const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\nitin\\.gemini\\antigravity\\brain\\f13c2b55-fb1d-49cb-a466-48f501252f1e';
const targetDir = 'C:\\Users\\nitin\\Downloads\\Trip_planner\\client\\public\\images';

if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}

const filesToCopy = [
    { src: 'city_tokyo_1775539978614.png', dest: 'tokyo.png' },
    { src: 'city_paris_1775539993162.png', dest: 'paris.png' },
    { src: 'city_newyork_1775540007230.png', dest: 'newyork.png' }
];

filesToCopy.forEach(file => {
    fs.copyFileSync(path.join(sourceDir, file.src), path.join(targetDir, file.dest));
    console.log(`Copied ${file.src} to ${file.dest}`);
});
