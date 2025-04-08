const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

//Function to format postal code into "XXXXXX"
function formatPostalCode(postalCode) {
    if (!postalCode) return null;
    return postalCode.replace(/\s+/g, "").toUpperCase();
}

//Function to get coordinates as a Promise
function getCoordinates(postalCode) {
    return new Promise((resolve, reject) => {
        if (!postalCode) {
            return reject(new Error("Invalid postal code input"));
        }

        const formattedCode = formatPostalCode(postalCode);
        const filePath = path.join(__dirname, "PostalCodes.csv");

        let found = false;

        fs.createReadStream(filePath)
            .pipe(csv(["postalcode", "longitude", "latitude"]))
            .on("data", (row) => {
                if (!row.postalcode || !row.latitude || !row.longitude) {
                    console.warn("Skipping malformed row:", row);
                    return;
                }

                const rowPostalCode = formatPostalCode(row.postalcode);

                if (rowPostalCode === formattedCode) {
                    found = true;
                    const latitude = parseFloat(row.latitude);
                    const longitude = parseFloat(row.longitude);
                    resolve({ latitude, longitude });
                }
            })
            .on("end", () => {
                if (!found) {
                    reject(new Error(`Postal code ${postalCode} not found`));
                }
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}

module.exports = { getCoordinates };
