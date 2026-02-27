const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../Tier 1 (A).xlsx');

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Headers:", data[0]);
    console.log("First row:", data[1]);
} catch (error) {
    console.error("Error reading file:", error);
}
