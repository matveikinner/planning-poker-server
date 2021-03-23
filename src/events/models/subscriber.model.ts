import { IsNotEmpty, IsString } from 'class-validator';
import { decorate } from 'ts-mixer';

export default class Subscriber {
  @decorate(IsNotEmpty())
  @decorate(IsString())
  id: string;

  @decorate(IsNotEmpty())
  @decorate(IsString())
  sender: string;

  @decorate(IsNotEmpty())
  @decorate(IsString())
  role: string;

  constructor(id: string, sender: string, role: string) {
    this.id = id;
    this.sender = sender;
    this.role = role;
  }
}
