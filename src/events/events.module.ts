import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [InMemoryDBModule.forFeature('events', {})],
  controllers: [EventsController],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
