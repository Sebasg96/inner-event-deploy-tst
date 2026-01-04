const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

try {
    let content = fs.readFileSync(envPath); // Read as buffer
    let text = '';

    // Check for UTF-16 LE BOM
    if (content[0] === 0xFF && content[1] === 0xFE) {
        console.log('Detected UTF-16 LE BOM. Converting...');
        text = content.toString('utf16le');
    } else {
        // Fallback or assume utf8
        text = content.toString('utf8');
    }

    // Clean up potential BOM characters if string still has them
    if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
    }

    // Write back as UTF-8
    fs.writeFileSync(envPath, text, 'utf8');
    console.log('Successfully converted .env to UTF-8');
} catch (e) {
    console.error('Error fixing .env:', e);
}
