import { IsNotEmpty, IsNumber } from 'class-validator';
import { Mixin } from 'ts-mixer';
import Room from '../models/room.model';
import Subscriber from '../models/subscriber.model';

export default class VoteDto extends Mixin(Subscriber, Room) {
  @IsNotEmpty()
  @IsNumber()
  vote: number;

  constructor(id: string, sender: string, role: string, vote: number) {
    super(id, sender, role);
    this.vote = vote;
  }
}
