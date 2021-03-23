import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EventsGateway } from 'src/events/events.gateway';

/**
 * @summary
 * Validates if there is an existing WebSocket room with requested room ID
 */
@Injectable()
export class WsRoomGuard implements CanActivate {
  constructor(private gateway: EventsGateway) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const room = request.body.room;
    if (!this.gateway.server.in(room).adapter.rooms[room])
      throw new ForbiddenException(`The WebSocket room ID ${room} does not exist`);
    return true;
  }
}
