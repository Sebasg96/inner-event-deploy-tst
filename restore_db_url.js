const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

if (!content.includes('DATABASE_URL=')) {
    console.log('Appending DATABASE_URL...');
    // Add a default connection string. The user can change this if needed.
    // Using a generic logic: postgres://user:password@localhost:5432/dbname
    const dbUrl = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inner_event"';
    content = content.trim() + '\n' + dbUrl + '\n';
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('DATABASE_URL added.');
} else {
    console.log('DATABASE_URL already exists.');
}
