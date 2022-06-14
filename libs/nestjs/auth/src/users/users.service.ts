import { Injectable, Logger } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
  rooms: string[];
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      rooms: [],
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      rooms: [],
    },
  ];

  async findId(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.userId === id);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async addOne(username: string, pass: string): Promise<User> {
    const user = {
      userId: this.users.length + 1,
      password: pass,
      username,
      rooms: [],
    };
    this.users.push(user);
    return user;
  }
}
