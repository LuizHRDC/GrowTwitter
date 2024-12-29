"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = void 0;
const crypto_1 = require("crypto");
class ID {
    constructor(_id = (0, crypto_1.randomUUID)()) {
        this._id = _id;
    }
    get id() {
        return this._id;
    }
    toJson() {
        return {
            id: this._id,
        };
    }
}
exports.ID = ID;
