const express = require("express")
const router = express.Router()
const { authenticateToken } = require("./auth")
const ListingService = require("../services/ListingService")
const listingService = new ListingService()

router.get("/", async (req, res) => {
  try {
    const filters = {
      minPrice: req.query.min_price ? Number.parseFloat(req.query.min_price) : undefined,
      maxPrice: req.query.max_price ? Number.parseFloat(req.query.max_price) : undefined,
      beds: req.query.bed === "3+" ? 3 : req.query.bed ? Number.parseInt(req.query.bed) : undefined,
      baths: req.query.bath === "3+" ? 3 : req.query.bath ? Number.parseInt(req.query.bath) : undefined,
    }

    const listings = await listingService.getListings(filters)
    res.json(listings)
  } catch (error) {
    console.error("Error fetching listings:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const listing = await listingService.getListingById(req.params.id)
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }
    res.json(listing)
  } catch (error) {
    console.error("Error fetching listing:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await listingService.getListingById(req.params.id)
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    const isAdmin = req.user.role === "admin"
    if (!isAdmin && listing.users_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    await listingService.deleteListing(req.params.id)
    res.json({ message: "Listing deleted successfully" })
  } catch (error) {
    console.error("Error deleting listing:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await listingService.getListingById(req.params.id)
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    const isAdmin = req.user.role === "admin"
    if (!isAdmin && listing.users_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    console.log("Received update data:", req.body)

    // Convert string boolean values to actual booleans
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: Number.parseFloat(req.body.price),
      bed: Number.parseInt(req.body.bed),
      bath: Number.parseInt(req.body.bath),
      url: req.body.url,
      has_laundry: req.body.has_laundry === "true" || req.body.has_laundry === true || req.body.has_laundry === 1,
      has_parking: req.body.has_parking === "true" || req.body.has_parking === true || req.body.has_parking === 1,
      has_gym: req.body.has_gym === "true" || req.body.has_gym === true || req.body.has_gym === 1,
      has_hvac: req.body.has_hvac === "true" || req.body.has_hvac === true || req.body.has_hvac === 1,
      has_wifi: req.body.has_wifi === "true" || req.body.has_wifi === true || req.body.has_wifi === 1,
      has_game_room:
        req.body.has_game_room === "true" || req.body.has_game_room === true || req.body.has_game_room === 1,
      is_pet_friendly:
        req.body.is_pet_friendly === "true" || req.body.is_pet_friendly === true || req.body.is_pet_friendly === 1,
      is_accessible:
        req.body.is_accessible === "true" || req.body.is_accessible === true || req.body.is_accessible === 1,
      property: {
        street_name: req.body.street_name,
        street_number: req.body.street_number,
        city: req.body.city,
        province: req.body.province,
        postal_code: req.body.postal_code,
      },
    }

    console.log("Processed update data:", updateData)

    await listingService.updateListing(req.params.id, updateData)
    res.json({ message: "Listing updated successfully" })
  } catch (error) {
    console.error("Error updating listing:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

module.exports = router
