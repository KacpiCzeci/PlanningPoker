import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
  rooms: Set<string>;
  roomsCreated: Set<string>;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      rooms: new Set<string>(),
      roomsCreated: new Set<string>(),
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      rooms: new Set<string>(),
      roomsCreated: new Set<string>(),
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
      rooms: new Set<string>(),
      roomsCreated: new Set<string>(),
    };
    this.users.push(user);
    return user;
  }
}
