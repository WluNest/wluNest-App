
const BaseModel = require('./BaseModel');


class Listing extends BaseModel {
    constructor(data = {}) {
        super(data);
    }

    validate() {
        if (!this.title || !this.description || !this.price) {
            throw new Error('Missing required fields');
        }
        if (this.price < 0) {
            throw new Error('Price cannot be negative');
        }
        return true;
    }

    static fromDatabase(data) {
        return new Listing({
            listing_id: data.listing_id,
            users_id: data.users_id,
            title: data.title,
            description: data.description,
            price: data.price,
            bed: data.bed,
            bath: data.bath,
            listing_image: data.listing_image,
            has_laundry: data.has_laundry,
            has_parking: data.has_parking,
            has_gym: data.has_gym,
            has_hvac: data.has_hvac,
            has_wifi: data.has_wifi,
            created_at: data.created_at
        });
    }
}

module.exports = Listing;
