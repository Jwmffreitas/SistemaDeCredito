import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCreditRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
