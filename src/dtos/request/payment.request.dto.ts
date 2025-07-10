import { IsInt, Min, IsString, IsNotEmpty, IsEmail, IsIn } from 'class-validator';

export class PaymentRequestDto {
  @IsInt({ message: 'Amount must be an integer' })
  @Min(1, { message: 'Amount must be at least 1' })
  amount!: number;

  @IsString({ message: 'Currency must be a string' })
  @IsNotEmpty({ message: 'Currency is required' })
  @IsIn(['USD', 'EUR', 'GBP'], { message: 'Currency must be one of: USD, EUR, GBP' }) 
  currency!: string;

  @IsString({ message: 'Source must be a string' })
  @IsNotEmpty({ message: 'Source is required' })
  source!: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;
} 