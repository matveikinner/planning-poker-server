import { Mixin } from 'ts-mixer';
import Room from '../models/room.model';
import Subscriber from '../models/subscriber.model';

export default class SubscribtionDto extends Mixin(Subscriber, Room) {}
