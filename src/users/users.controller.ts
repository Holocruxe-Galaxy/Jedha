import { Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {
    const users = this.userService.getUsers();
    return users;
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    const user = this.userService.getUserById(id);
    return user;
  }

  @Get('/search/:name')
  async findUsersByName(@Param('name') name: string) {
    const users = await this.userService.findUserByname(name);
    return users;
  }
  @Put('/ban/:id')
  banUser(@Param('id') id: string) {
    return this.userService.userBan(id);
  }
}
