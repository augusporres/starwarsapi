import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody} from '@nestjs/swagger';

// @ApiTags('Greetings')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

//   @Get('hello')
//   @ApiOperation({summary: 'Say Hello to client'})
//   @ApiResponse({ status: 200, description: 'Hello', type: 'string'})
//   @ApiResponse({status: 404, description: 'Endpoint not found'})
//   getHello(): string {
//     return this.appService.getHello();
//   }
}
