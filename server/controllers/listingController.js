// ListingController


const ListingService = require('../services/ListingService');
const listingService = new ListingService();

class ListingController {
    async deleteListing(req, res) {
        const listingId = req.params.id;
        const userId = req.user.id;

        try {
            const listing = await listingService.getListingById(listingId);
            if (!listing) {
                return res.status(404).json({ error: "Listing not found" });
            }

            if (listing.users_id !== userId) {
                return res.status(403).json({ error: "You are not authorized to delete this listing." });
            }

            await listingService.deleteListing(listingId);
            res.json({ message: "Listing deleted successfully." });
        } catch (error) {
            console.error("Delete listing error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateListing(req, res) {
        const listingId = parseInt(req.params.id);
        const userId = parseInt(req.user.id);
        const isAdmin = req.user.role === "admin";
        const {
            title, description, price, bed, bath, url,
            has_laundry, has_parking, has_gym, has_hvac,
            has_wifi, has_game_room, is_pet_friendly, is_accessible
        } = req.body;

        try {
            const listing = await listingService.getListingById(listingId);
            if (!listing) {
                return res.status(404).json({ error: "Listing not found" });
            }

            if (!isAdmin && listing.users_id !== userId) {
                return res.status(403).json({ error: "You are not authorized to update this listing." });
            }

            await listingService.updateListing(listingId, {
                title, description, price, bed, bath, url,
                has_laundry, has_parking, has_gym, has_hvac,
                has_wifi, has_game_room, is_pet_friendly, is_accessible
            });

            res.json({ message: "Listing updated successfully." });
        } catch (error) {
            console.error("Update listing error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getListings(req, res) {
        try {
            const filters = {
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                beds: req.query.beds,
                baths: req.query.baths
            };
            
            const listings = await listingService.getListings(filters);
            res.json(listings);
        } catch (error) {
            console.error('Error in getListings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getListingById(req, res) {
        try {
            const listing = await listingService.getListingById(req.params.id);
            if (!listing) {
                return res.status(404).json({ error: 'Listing not found' });
            }
            res.json(listing);
        } catch (error) {
            console.error('Error in getListingById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createListing(req, res) {
        try {
            const listing = await listingService.createListing(req.body);
            res.status(201).json(listing);
        } catch (error) {
            console.error('Error in createListing:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

//Create a singleton instance
const listingController = new ListingController();

//Export controller methods
module.exports = {
    deleteListing: listingController.deleteListing.bind(listingController),
    updateListing: listingController.updateListing.bind(listingController),
    getListings: listingController.getListings.bind(listingController),
    getListingById: listingController.getListingById.bind(listingController),
    createListing: listingController.createListing.bind(listingController)
};
