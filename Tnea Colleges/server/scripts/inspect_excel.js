const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../../Placement Report with descripition.xlsx');
console.log("Reading file:", filePath);

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Get headers (first row)
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (jsonData.length > 0) {
        console.log("Headers:", jsonData[0]);
        console.log("First Row Data:", jsonData[1]);
    } else {
        console.log("Sheet is empty.");
    }

} catch (err) {
    console.error("Error reading Excel:", err);
}
