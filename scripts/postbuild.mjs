import {mkdirSync,copyFileSync,writeFileSync} from 'node:fs';
mkdirSync('dist/game',{recursive:true});
copyFileSync('dist/index.html','dist/game/index.html');
writeFileSync('dist/.nojekyll','');
