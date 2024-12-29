"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const Identifier_1 = require("./Identifier");
class Like extends Identifier_1.ID {
    constructor(_user, _tweet) {
        super();
        this._user = _user;
        this._tweet = _tweet;
    }
    get user() {
        return this._user;
    }
    get tweet() {
        return this._tweet;
    }
    toJson() {
        return {
            id: this.id,
            user: this._user.toJson(),
            tweet: this._tweet.toJson(),
        };
    }
}
exports.Like = Like;
