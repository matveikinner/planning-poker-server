import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EventsGateway } from 'src/events/events.gateway';

/**
 * @summary
 * Validates if this WebSocket client ID is already in another room(s)
 */
@Injectable()
export class WsIsClientInOtherRoomGuard implements CanActivate {
  constructor(private gateway: EventsGateway) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const client = request.body.id;

    const arr: string[] = [];

    // Get a dictionary of all the rooms that we have in this namespace
    const roomDictionary = this.gateway.server.in(client).adapter.rooms;

    // Get a dictionary keys (rooms) which exist in this namespace
    const roomKeys = Object.keys(roomDictionary);

    // Get a dictionary of all the sockets in a room and extract keys which exist in this room
    roomKeys.map((roomKey) => arr.push(...Object.keys(roomDictionary[roomKey].sockets)));

    // Check how many client ID instances are in rooms
    const count = arr.filter((x) => x === client).length;

    // Check if this client ID is in more than one room (default)
    if (count > 1)
      throw new ForbiddenException(`The WebSocket connection with client ID ${client} is already in a room`);
    return true;
  }
}
