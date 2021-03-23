import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EventsGateway } from 'src/events/events.gateway';

/**
 * @summary
 * Validates if there is an existing WebSocket connection with requested client ID
 */
@Injectable()
export class WsClientGuard implements CanActivate {
  constructor(private gateway: EventsGateway) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const client = request.body.id;
    if (!this.gateway.server.sockets.adapter.sids[client])
      throw new ForbiddenException(`The WebSocket connection with client ID ${client} does not exist`);
    return true;
  }
}
