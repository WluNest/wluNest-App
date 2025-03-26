const fs = require('fs');
const path = require('path');
const multer = require("multer");

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

// Function to handle image uploads and move files to the listing folder
function handleImageUpload(req, listingId) {
  return new Promise((resolve, reject) => {
    // Check if files are received
    if (!req.files || req.files.length === 0) {
      return reject(new Error("No files uploaded"));
    }

    // Log the files received
    console.log("Files received:", req.files);

    const listingDir = `images/listings/${listingId}`;

    // Ensure the listing directory exists
    if (!fs.existsSync(listingDir)) {
      fs.mkdirSync(listingDir, { recursive: true });
    }

    // Move images to the listing folder with new unique filenames
    req.files.forEach((file, index) => {
      const newFileName = `${index + 1}${path.extname(file.originalname)}`; // Ensure filename is a number starting from 1
      const newPath = path.join(listingDir, newFileName); // Construct the new file path

      console.log(`Renaming file: ${file.path} -> ${newPath}`); // Log the renaming action

      // Ensure the file exists before renaming
      if (fs.existsSync(file.path)) {
        fs.renameSync(file.path, newPath); // Rename and move the file
      } else {
        console.error(`File not found: ${file.path}`);
      }
    });

    // Return the directory where the images are saved
    resolve(listingDir);
  });
}

// Multer storage config (temp storage before moving to listing-specific folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Log to see if the files are reaching this step
    console.log("File destination:", file.originalname);
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Ensure unique filenames by using the original file's timestamp or generating a random number
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    console.log("Generated filename:", uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg images are allowed!"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// // Example usage:
// for (i = 0; i < 5; i++) {
//     createDirectoryFromListingID(i);
//     deleteDirectoryFromListingID(i);
// }
// createDirectoryFromListingID(2);
// console.log(getImagesFromListingID(1));
// console.log(getImageFromFloorplanID(1));

module.exports = { handleImageUpload, upload};
