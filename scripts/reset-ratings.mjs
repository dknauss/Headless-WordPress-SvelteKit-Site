import fs from 'node:fs';
import path from 'node:path';

const dbPath = path.join(process.cwd(), '.data', 'ratings.sqlite');
const walPath = `${dbPath}-wal`;
const shmPath = `${dbPath}-shm`;

for (const filePath of [dbPath, walPath, shmPath]) {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		console.log(`Removed ${filePath}`);
	}
}

console.log('Ratings store reset complete.');
