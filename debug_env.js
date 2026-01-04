const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env');
console.log('Checking .env at:', envPath);

if (fs.existsSync(envPath)) {
    const rawContent = fs.readFileSync(envPath, 'utf8');
    console.log('Raw content length:', rawContent.length);
    const config = dotenv.parse(rawContent);
    console.log('Parsed keys:', Object.keys(config));
    if (config.DATABASE_URL) {
        console.log('DATABASE_URL is found (length: ' + config.DATABASE_URL.length + ')');
    } else {
        console.log('DATABASE_URL is MISSING in parsed content.');
        console.log('First 50 chars of raw content:', rawContent.substring(0, 50));
    }
} else {
    console.log('.env file NOT found');
}
