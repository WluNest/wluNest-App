const BaseService = require('./BaseService.js');

class RoommateService extends BaseService {
    async getRoommates() {
        const query = `
            SELECT 
                u.users_id, 
                u.first_name, 
                u.last_name, 
                u.email,
                u.gender,  
                u.religion,
                u.university, 
                u.year, 
                u.program,
                u.about_you,
                u.looking_for_roommate,
                (
                    SELECT p.city 
                    FROM property p 
                    JOIN listings l ON p.listing_id = l.listing_id 
                    WHERE l.users_id = u.users_id 
                    LIMIT 1
                ) AS city
            FROM users u
            WHERE u.looking_for_roommate = TRUE`;
        
        return await this.query(query);
    }

    async updateRoommateStatus(userId, lookingForRoommate) {
        const query = `
            UPDATE users 
            SET looking_for_roommate = ?
            WHERE users_id = ?`;
        
        await this.query(query, [lookingForRoommate, userId]);
    }
}

module.exports = new RoommateService();
