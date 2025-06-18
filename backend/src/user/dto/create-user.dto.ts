import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {

  // Aceita CPF ou CNPJ simples (sem formatação). Pode ajustar regex conforme quiser.
  @IsString()
  @IsNotEmpty({ message: 'O email é obrigatorio.' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'O email deve ser valido',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @Length(8, 100, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;
}
