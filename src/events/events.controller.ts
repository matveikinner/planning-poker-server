import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WsClientGuard } from 'src/shared/guards/ws-client.guard';
import { WsIsClientInOtherRoomGuard } from 'src/shared/guards/ws-is-client-in-other-room.guard';
import { WsIsClientInThisRoomGuard } from 'src/shared/guards/ws-is-client-in-this-room.guard';
import { WsRoomGuard } from 'src/shared/guards/ws-room.guard';
import CreateEventDto from './dtos/create-event.dto';
import SubscriptionDto from './dtos/subscription.dto';
import VoteDto from './dtos/vote.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(WsClientGuard, WsIsClientInOtherRoomGuard)
  @Post('create')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @UseGuards(WsClientGuard, WsRoomGuard, WsIsClientInOtherRoomGuard)
  @Post('subscribe')
  subscribeEvent(@Body() subscriptionDto: SubscriptionDto) {
    return this.eventsService.subscribeEvent(subscriptionDto);
  }

  @UseGuards(WsClientGuard, WsRoomGuard)
  @Post('unsubscribe')
  unsubscribeEvent(@Body() subscriptionDto: SubscriptionDto) {
    return this.eventsService.unsubscribeEvent(subscriptionDto);
  }

  @UseGuards(WsClientGuard, WsRoomGuard, WsIsClientInThisRoomGuard)
  @Post('vote')
  vote(@Body() voteDto: VoteDto) {
    return this.eventsService.vote(voteDto);
  }
}
