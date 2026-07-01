const BaseService = require('./BaseService');

class AdminService extends BaseService {
    async getAllListings() {
        try {
            const query = `
                SELECT l.*, u.username, u.email
                FROM listings l
                JOIN users u ON l.users_id = u.users_id
                ORDER BY l.created_at DESC
            `;
            return await this.query(query);
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = AdminService;
