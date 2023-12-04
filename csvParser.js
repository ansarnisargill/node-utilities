const fs = require('fs');
const papa = require('papaparse');


const inputFile = 'result.csv';
const outputFile = 'filtered_data.csv';

let filteredRows = [];
let discardedRows = [];

fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    papa.parse(data, {
        header: true,
        dynamicTyping: true,
        step: (row) => {
            const numColumns = Object.keys(row.data).length;

            const bioValue = row.data['bio'];
            const locationValue = row.data['location'];

            if (numColumns == 18 && bioValue && bioValue.length >= 30 && locationValue) {
                filteredRows.push(row.data);
            }
            else {
                discardedRows.push(row.data);
            }
        },
        complete: () => {
            let outputCsv = papa.unparse(filteredRows);

            fs.writeFileSync(outputFile, outputCsv);
            fs.writeFileSync("discard.csv", papa.unparse(discardedRows))

            console.log('Filtering completed. Filtered data saved to', outputFile);
        },
        error: (err) => {
            console.error('Error parsing the CSV file:', err);
        },
    });
});
