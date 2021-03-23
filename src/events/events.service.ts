import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import CreateEventDto from './dtos/create-event.dto';
import SubscribtionDto from './dtos/subscription.dto';
import VoteDto from './dtos/vote.dto';
import EventEntity from './entities/event.entity';
import { EventsGateway } from './events.gateway';
import EVENT from './events.namespace';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly eventsRepository: InMemoryDBService<EventEntity>,
    private readonly gateway: EventsGateway
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    const { id, sender, role, eventName, points, maxPlayers } = createEventDto;
    const room = uuid();

    try {
      this.logger.log(`Attempting to create a new event in database with ID ${room}`);
      this.eventsRepository.create({
        id: room,
        eventName,
        players: [{ id, name: sender, role, vote: 0 }],
        points,
        maxPlayers,
      });
    } catch (err) {
      this.logger.error(`Error while attempting to create a new event in database with ID ${room}`, err);
      throw err;
    }

    try {
      this.logger.log(`Attempting to create a new room with ID ${room}`);
      this.gateway.server.in(room).adapter.add(id, room);
    } catch (err) {
      this.logger.error(`Error while attempting to create a new room with ID ${room}`, err);
      throw err;
    }

    return { ...createEventDto, room, message: `Success while attempting to create a new room with ID ${room}` };
  }

  subscribeEvent(subscriptionDto: SubscribtionDto) {
    const { id, sender, role, room } = subscriptionDto;

    const event = this.eventsRepository.get(room);

    try {
      this.logger.log(`Attempting to include a new player in database with ID ${room}`);
      this.eventsRepository.update({ ...event, players: [...event.players, { id, name: sender, role }] });
    } catch (err) {
      this.logger.error(`Error while attempting to include a new player in database with ID ${room}`, err);
      throw err;
    }

    try {
      this.logger.log(`Attempting to subscribe to an existing room with ID ${room}`);
      this.gateway.server.in(room).adapter.add(id, room);
      this.gateway.server.to(room).emit(EVENT.TYPES.SUBSCRIBE, {
        ...subscriptionDto,
        message: 'Success while attempting to subscribe to an event',
      });
    } catch (err) {
      this.logger.error(`Error while attempting to subscribe to an existing room with ID ${room}`, err);
      throw err;
    }

    return { ...event, players: [...event.players, { id, name: sender, role }] };
  }

  unsubscribeEvent(subscriptionDto: SubscribtionDto) {
    const { id, sender, role, room } = subscriptionDto;

    if (!this.gateway.server.in(room).adapter.rooms[room]) {
      this.logger.log(
        `Warning while attempting to unsubscribe from room with ID ${room}. The room with ID ${room} does not exist`
      );
      return { ...subscriptionDto, message: `The room with ID ${room} does not exist` };
    }

    try {
      this.logger.log(`Attempting to unsubscribe from room with ID ${room}`);
      this.gateway.server.in(room).adapter.del(id, room);
      this.gateway.server.to(room).emit(EVENT.TYPES.UNSUBSCRIBE, subscriptionDto);
    } catch (err) {
      this.logger.error(`Error while attempting to unsubscribe from room with ID ${room}`, err);
      throw err;
    }

    return { ...subscriptionDto, message: `Success while attempting to unsubscribe from room with ID ${room}` };
  }

  vote(voteDto: VoteDto) {
    const { id, sender, role, room, vote } = voteDto;

    const event = this.eventsRepository.get(room);

    // Check if the vote matches available values
    if (!event.points.find((point) => point === vote))
      throw new BadRequestException(`Vote ${vote} does not match available values ${event.points}`);

    const playerIndex = event.players.findIndex((player) => player.id === id);
    const updatedPlayers = [...event.players];
    updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], vote };

    try {
      this.logger.log(`Attempting to include vote to database with ID ${room}`);
      this.eventsRepository.update({ ...event, players: updatedPlayers });
    } catch (err) {
      this.logger.error(`Attempting to include vote to database with ID ${room}`, err);
      throw err;
    }

    try {
      this.logger.log(`Attempting to vote in room with ID ${room}`);
      this.gateway.server.to(room).emit(EVENT.TYPES.VOTE, voteDto);
    } catch (err) {
      this.logger.error(`Error while attempting to vote in room with ID ${room}`, err);
      throw err;
    }

    return { ...voteDto, message: `Success while attempting to vote in room with ID ${room}` };
  }
}
