class BaseModel {
    constructor(data = {}) {
        this.initializeData(data);
    }

    initializeData(data) {
        Object.assign(this, data);
    }

    toJSON() {
        return { ...this };
    }

    validate() {
        return true; // Override in child classes
    }
}

module.exports = BaseModel;