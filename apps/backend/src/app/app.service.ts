import { Injectable } from '@nestjs/common';
let counter = 0;
@Injectable()
export class AppService {
  getData(): { message: string; counter: number } {
    counter++;
    return { message: 'Welcome to backend!', counter };
  }
}
