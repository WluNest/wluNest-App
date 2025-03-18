const fs = require('fs');
const path = require('path');

// Input a listing ID as an integer (number), a listing directory will be created that provides a folder in /images/listings/{number}
// used for new listing creation
function createDirectoryFromListingID(number) {
    if (!Number.isInteger(number)) {
        console.error('Error: Input must be an integer.');
        return;
    }

    const dirName = number.toString();

    // Ensure the directory name is valid (avoiding OS-restricted characters)
    if (/[*?"<>|]/.test(dirName)) {
        console.error('Error: Invalid directory name.');
        return;
    }

    let dirPath = path.join(process.cwd(), "images", "listings", dirName);

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            console.log(`Directory '${dirName}' created successfully.`);
        } else {
            console.log(`Directory '${dirName}' already exists.`);
        }
    } catch (error) {
        console.error('Error creating directory:', error.message);
    }
}

// Input a listing ID as an integer (number), if a listing directory /images/listings/{number} is present it and all its contents will be deleted. 
// used for deleting files from deleted listings
function deleteDirectoryFromListingID(number) {
    if (!Number.isInteger(number)) {
        console.error('Error: Input must be an integer.');
        return;
    }

    const dirName = number.toString();
    let dirPath = path.join(process.cwd(), "images", "listings", dirName);

    try {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`Directory '${dirName}' deleted successfully.`);
        } else {
            console.log(`Directory '${dirName}' does not exist.`);
        }
    } catch (error) {
        console.error('Error deleting directory:', error.message);
    }
}

// Input a listing ID as an integer (number), if a listing directory /images/listings/{number} is present it and all its contents will be parsed as filepaths and returned in an array.
// Used for retreiving images for listings as well as viewing an individual listing.
function getImagesFromListingID(number) {
    if (!Number.isInteger(number)) {
        console.error('Error: Input must be an integer.');
        return [];
    }

    const dirName = number.toString();
    let dirPath = path.join(process.cwd(), "images", "listings", dirName);

    try {
        if (fs.existsSync(dirPath)) {
            return fs.readdirSync(dirPath).filter(file => 
                file.match(/\.(jpg|jpeg|png|gif)$/i)
            ).map(file => path.join(dirPath, file));
        } else {
            console.log(`Directory '${dirName}' does not exist.`);
            return [];
        }
    } catch (error) {
        console.error('Error retrieving images:', error.message);
        return [];
    }
}

// Input a Floorplan ID as an integer (number), if an image exists in /images/floorplans/{number}.jpg is present its filepath will be returned.
// Used for retreiving images for floorplans.
function getImageFromFloorplanID(number) {
    if (!Number.isInteger(number)) {
        console.error('Error: Input must be an integer.');
        return null;
    }

    const filePath = path.join(process.cwd(), "images", "floorplans", `${number}.jpg`);
    
    if (fs.existsSync(filePath)) {
        return filePath;
    } else {
        console.log(`Floorplan image '${number}.jpg' does not exist.`);
        return null;
    }
}

// // Example usage:
// for (i = 0; i < 5; i++) {
//     createDirectoryFromListingID(i);
//     deleteDirectoryFromListingID(i);
// }
// createDirectoryFromListingID(2);
// console.log(getImagesFromListingID(1));
// console.log(getImageFromFloorplanID(1));