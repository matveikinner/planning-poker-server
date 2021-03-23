import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

/**
 * @summary
 * Exception Filter to transform validation pipe exceptions thrown inside WebSocket to proper HTTP error(s)
 *
 * @link https://docs.nestjs.com/websockets/exception-filters
 */
@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const properError = new WsException(exception.getResponse());
    super.catch(properError, host);
  }
}
