import { User } from "./User"
import { Tweet } from "./Tweet"
import { ID } from "./Identifier"

export class Like extends ID {
  constructor(
    private readonly _user: User, 
    private readonly _tweet: Tweet
  ) 
  {
    super()
  }

  public get user(): User {
    return this._user
  }

  public get tweet(): Tweet {
    return this._tweet
  }

  public toJson() {
    return {
      id: this.id,
      user: this._user.toJson(),
      tweet: this._tweet.toJson(),
    }
  }
}
