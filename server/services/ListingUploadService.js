const fs = require("fs")
const path = require("path")
const BaseService = require("./BaseService")
const { getCoordinates } = require("../coordinateLookup")

class ListingUploadService extends BaseService {
  async createListingWithImages(userId, listingData, files) {
    try {
      console.log("Creating listing for user:", userId)
      console.log("Listing data:", listingData)
      console.log("Files received:", files.length)

      const toBool = (val) => {
        if (val === "1" || val === 1 || val === "true" || val === true) return 1
        return 0
      }

      // Insert the listing
      const listingResult = await this.query(
        `INSERT INTO listings (
                    users_id, title, description, price, listing_image, bed, bath, url,
                    has_laundry, has_parking, has_gym, has_hvac, has_wifi,
                    has_game_room, is_pet_friendly, is_accessible
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          listingData.title,
          listingData.description,
          listingData.price,
          "",
          listingData.bed,
          listingData.bath,
          listingData.url,
          toBool(listingData.has_laundry),
          toBool(listingData.has_parking),
          toBool(listingData.has_gym),
          toBool(listingData.has_hvac),
          toBool(listingData.has_wifi),
          toBool(listingData.has_game_room),
          toBool(listingData.is_pet_friendly),
          toBool(listingData.is_accessible),
        ],
      )

      const listingId = listingResult.insertId
      console.log("Created listing with ID:", listingId)

      // Handle image uploads
      const listingDir = path.join(__dirname, "..", "images", "listings", listingId.toString())
      console.log("Creating directory:", listingDir)

      // Ensure the directory exists
      if (!fs.existsSync(listingDir)) {
        fs.mkdirSync(listingDir, { recursive: true })
      }

      files.forEach((file, index) => {
        const newFileName = `${index + 1}${path.extname(file.originalname)}`
        const newPath = path.join(listingDir, newFileName)

        console.log(`Moving file from ${file.path} to ${newPath}`)

        // Check if source file exists
        if (fs.existsSync(file.path)) {
          // Read the file and write it to the new location
          const fileData = fs.readFileSync(file.path)
          fs.writeFileSync(newPath, fileData)

          // Delete the original file
          try {
            fs.unlinkSync(file.path)
          } catch (err) {
            console.error(`Error deleting original file: ${err.message}`)
          }

          console.log(`Successfully moved file to ${newPath}`)
        } else {
          console.error(`File not found at path: ${file.path}`)
          throw new Error(`File not found at path: ${file.path}`)
        }
      })

      // Update listing with image path
      const relativeImagePath = `images/listings/${listingId}`
      await this.query("UPDATE listings SET listing_image = ? WHERE listing_id = ?", [relativeImagePath, listingId])

      try {
        // Get coordinates and create property entry
        const coords = await getCoordinates(listingData.postal_code)
        await this.query(
          `INSERT INTO property (
                    listing_id, street_name, street_number, city, province, postal_code, latitude, longitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            listingId,
            listingData.street_name,
            listingData.street_number,
            listingData.city,
            listingData.province,
            listingData.postal_code,
            coords.latitude,
            coords.longitude,
          ],
        )
      } catch (coordError) {
        console.error("Error with coordinates:", coordError)
        // Still insert property without coordinates
        await this.query(
          `INSERT INTO property (
                    listing_id, street_name, street_number, city, province, postal_code
                ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            listingId,
            listingData.street_name,
            listingData.street_number,
            listingData.city,
            listingData.province,
            listingData.postal_code,
          ],
        )
      }

      return { listingId }
    } catch (error) {
      console.error("ListingUploadService error:", error)
      throw error
    }
  }
}

module.exports = ListingUploadService
