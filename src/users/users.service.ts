import {
  Injectable,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers() {
    try {
      const users = await this.usersRepository.find({
        select: [
          'id',
          'name',
          'username',
          'lastname',
          'image_profile_url',
          'email',
          'ban',
          'premium',
        ],
      });

      if (!users.length) {
        return new HttpException(
          'there are currently no users in the database',
          HttpStatus.NOT_FOUND,
        );
      }
      return users;
    } catch (error) {
      return new HttpException(error.message, 500);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id } });
      if (!user) {
        return new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findUserByname(
    // username: string,
    name: string,
    // lastname: string,
  ) {
    try {
      if (!name.length) {
        throw new HttpException(
          'it is necessary to enter at least one letter to be able to search',
          HttpStatus.BAD_REQUEST,
        );
      }
      const allUsers = await this.usersRepository.find({
        select: [
          'id',
          'name',
          'username',
          'lastname',
          'image_profile_url',
          'email',
          'ban',
          'premium',
        ],
      });
      function removeTildes(texto: string): string {
        const tildes = {
          á: 'a',
          é: 'e',
          í: 'i',
          ó: 'o',
          ú: 'u',
          Á: 'A',
          É: 'E',
          Í: 'I',
          Ó: 'O',
          Ú: 'U',
        };
        return texto.replace(/[áéíóúÁÉÍÓÚ]/g, (letra) => tildes[letra]);
      }
      const usersFilter = allUsers.filter((e) =>
        [
          removeTildes(e.username.toUpperCase()),
          removeTildes(e.name.toUpperCase()),
          removeTildes(e.lastname.toUpperCase()),
        ]
          .join(' ')
          .includes(removeTildes(name.toUpperCase())),
      );
      if (!usersFilter.length) {
        return new HttpException('no match found', HttpStatus.NOT_FOUND);
      }
      return usersFilter;
    } catch (error) {
      console.log(error);
    }
  }

  async userBan(id: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id } });
      if (!user) {
        return new HttpException(
          'the user was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const userBan = await this.usersRepository.save({
        ...user,
        ban: !user.ban,
      });
      if (!userBan.ban) {
        return 'the user was successfully unbanned';
      } else {
        return 'the user was successfully banned';
      }
    } catch (error) {
      return new HttpException(error, 400);
    }
  }
}
