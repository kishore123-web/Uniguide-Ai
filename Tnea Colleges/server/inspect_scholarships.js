const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../TNEA_Government_Schemes_and_Scholarships.xlsx');

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Get array of arrays

    console.log("Sheet Name:", sheetName);
    console.log("Headers:", data[0]);
    console.log("First row of data:", data[1]);
    console.log("Second row of data:", data[2]);
} catch (error) {
    console.error("Error reading file:", error);
}
