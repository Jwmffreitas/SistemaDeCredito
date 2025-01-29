import { IsNotEmpty, IsString } from 'class-validator';

export class CreditStatusDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
