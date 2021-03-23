import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventsModule } from './events/events.module';
import { HttpTransformInterceptor } from './shared/interceptors/http-transform.interceptor';

@Module({
  imports: [EventsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpTransformInterceptor,
    },
  ],
})
export class AppModule {}
