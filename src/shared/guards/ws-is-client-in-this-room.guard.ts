import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EventsGateway } from 'src/events/events.gateway';

/**
 * @summary
 * Validates if this WebSocket client ID exists in this room
 */
@Injectable()
export class WsIsClientInThisRoomGuard implements CanActivate {
  constructor(private gateway: EventsGateway) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const client = request.body.id;
    const room = request.body.room;

    // Get a dictionary of all the rooms that we have in this namespace
    const roomDictionary = this.gateway.server.in(client).adapter.rooms;

    // Get a sockets in a room which exist in this namespace
    const socketsInRoom = Object.keys(roomDictionary[room].sockets);

    // Check if this client is in this room
    const isInRoom = socketsInRoom.includes(client);

    // Check if this client ID is in more than one room (default)
    if (!isInRoom)
      throw new ForbiddenException(`The WebSocket connection with client ID ${client} is not in room ${room}`);
    return true;
  }
}
