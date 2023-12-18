import {
  Controller,
  Get,
  Param,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    if (users['status']) {
      throw new HttpException(users['message'], users['status']);
    }
    return users;
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (user['status']) {
      throw new HttpException(user['message'], user['status']);
    }

    return user;
  }

  @Get('/search/:name')
  async findUsersByName(@Param('name') name: string) {
    if (name === ' ') {
      throw new HttpException(
        'it is necessary to enter at least one letter to be able to search',
        HttpStatus.BAD_REQUEST,
      );
    }
    const users = await this.userService.findUserByname(name);
    if (users['status']) {
      throw new HttpException(users['message'], users['status']);
    }
    return users;
  }
  @Put('/ban/:id')
  async banUser(@Param('id') id: string) {
    const response = await this.userService.userBan(id);
    if (response['status']) {
      throw new HttpException(response['message'], response['status']);
    }
    return response;
  }
}
