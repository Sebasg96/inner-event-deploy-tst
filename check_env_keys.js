const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const rawContent = fs.readFileSync(envPath, 'utf8');
    const config = dotenv.parse(rawContent);
    console.log('Keys in .env:', Object.keys(config));
} else {
    console.log('.env file missing');
}
