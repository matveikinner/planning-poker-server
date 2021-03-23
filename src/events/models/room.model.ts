import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { decorate } from 'ts-mixer';

export default class Room {
  @decorate(IsNotEmpty())
  @decorate(IsString())
  @decorate(IsUUID('4'))
  room: string;

  constructor(room: string) {
    this.room = room;
  }
}
