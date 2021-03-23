import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  statusCode: number;
  data: T;
}

/**
 * @summary
 * Interceptor to map, transform and serialize WebSocket response data
 *
 * @link https://docs.nestjs.com/interceptors#response-mapping
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<WsResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<WsResponse<T>>): Observable<WsResponse<Response<T>>> {
    return next.handle().pipe(
      map((data) => ({
        event: data.event,
        data: {
          statusCode: 200,
          data: data.data,
        },
      }))
    );
  }
}
