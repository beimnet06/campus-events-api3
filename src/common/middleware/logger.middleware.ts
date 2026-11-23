
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log(
      `${req.method} ${req.originalUrl} - ${new Date().toISOString()}`,
    );

    next();
  }
}
