import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { PlayerEntity } from './player.entity';

export default interface EventEntity extends InMemoryDBEntity {
  id: string;
  eventName: string;
  players: PlayerEntity[];
  points: number[];
  maxPlayers: number;
}
