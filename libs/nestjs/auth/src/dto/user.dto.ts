import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.service';

export class UserDTO implements User {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  
  @ApiProperty({ type: [String] })
  rooms: string[];
}
