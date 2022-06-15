import { ApiProperty } from "@nestjs/swagger";

export class JwtDTO {
    @ApiProperty()
    access_token: string
} 