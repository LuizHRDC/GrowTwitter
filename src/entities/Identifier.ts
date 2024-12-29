import { randomUUID } from "crypto"

export class ID {
    constructor(private _id: string = randomUUID()) {}

    get id() {
        return this._id
    }

    public toJson() {
        return {
            id: this._id,
        }
    }
}