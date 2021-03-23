import { Injectable, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  GatewayMetadata,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsExceptionFilter } from 'src/shared/filters/ws-exception.filter';
import EVENT from './events.namespace';

const options: GatewayMetadata = {
  pingTimeout: 60000,
};

@UseFilters(new WsExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway(options)
@Injectable()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  afterInit(server: Server) {
    console.log('Success while attempting to instantiate WebSocket Server');
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log(`Success while attempting to create a new WebSocket connection ${client.id}`);
    client.emit(EVENT.TYPES.CONNECT, `Success while attempting to establish a new WebSocket connection ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Success while attempting to destroy an existing websocket connection ${client.id}`);
  }
}
