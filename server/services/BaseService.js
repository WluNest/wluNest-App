const mysql = require('mysql2/promise');
const db = require('../db');

class BaseService {
    constructor() {
        this.db = db;
    }

    handleError(error) {
        console.error('Database error:', error);
        throw new Error('An error occurred while processing your request');
    }

    async query(sql, params = []) {
        try {
            const [results] = await this.db.execute(sql, params);
            return results;
        } catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = BaseService;
