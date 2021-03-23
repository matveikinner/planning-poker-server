import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Subscriber from '../models/subscriber.model';

export default class CreateEventDto extends Subscriber {
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  points: number[];

  @IsNotEmpty()
  @IsNumber()
  maxPlayers: number;

  constructor(id: string, sender: string, role: string, eventName: string, points: number[], maxPlayers: number) {
    super(id, sender, role);
    this.eventName = eventName;
    this.points = points;
    this.maxPlayers = maxPlayers;
  }
}
