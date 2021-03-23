import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface PlayerEntity extends InMemoryDBEntity {
  id: string;
  name: string;
  role: string;
  vote?: number;
}
