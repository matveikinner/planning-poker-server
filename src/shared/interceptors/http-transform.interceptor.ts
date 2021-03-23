import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  statusCode: number;
  data: T;
}

/**
 * @summary
 * Interceptor to map, transform and serialize HTTP response data
 *
 * @link https://docs.nestjs.com/interceptors#response-mapping
 */
@Injectable()
export class HttpTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse<Response<T>>().statusCode,
        data,
      }))
    );
  }
}
