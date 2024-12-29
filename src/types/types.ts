import { User } from '../entities/User'

export interface Likeable {
    like(user: User): void
  }

export enum tweetType {
    normal = 'normal',
    reply = 'reply'
}