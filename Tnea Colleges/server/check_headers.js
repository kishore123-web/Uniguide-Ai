
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const rootDir = 'c:/Users/kishore/3D Objects/Tnea Colleges';
const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.xlsx'));

if (files.length > 0) {
    const file = files[0];
    console.log(`Inspecting headers of: ${file}`);
    const filePath = path.join(rootDir, file);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Get headers
    const json = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    if (json.length > 0) {
        console.log('Headers:', json[0]);
    } else {
        console.log('Empty sheet');
    }
} else {
    console.log('No Excel files found in root.');
}
