
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const code = exception['code'];
    const status = (code === '23505' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR)
    const message = (code === '23505' ? exception['detail'] :'Unexpected error, check server logs' )

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message,
        path: request.url,
      });
  }
} 