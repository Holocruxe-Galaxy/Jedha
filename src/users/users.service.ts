import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    return user;
  }
  async findUserByname(
    // username: string,
    name: string,
    // lastname: string,
  ): Promise<User[]> {
    const allUsers = await this.usersRepository.find({
      select: [
        'id',
        'name',
        'username',
        'lastname',
        'image_profile_url',
        'email',
      ],
    });
    const usersFilter = allUsers.filter(
      (e) =>
        e.name.toUpperCase().includes(name.toUpperCase()) ||
        e.lastname.toUpperCase().includes(name.toUpperCase()) ||
        e.username.toUpperCase().includes(name.toUpperCase()),
    );

    return usersFilter;
  }

  async userBan(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    const userBan = this.usersRepository.save({ ...user, ban: !user.ban });
    return userBan;
  }
}
