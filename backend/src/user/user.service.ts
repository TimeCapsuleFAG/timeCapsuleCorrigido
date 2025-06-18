import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';;
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  /**
   *
   * Injetando entidade dentro do service para uso.
   */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   *
   * Para criar um registro no banco com typeORM precisamos criar o objeto e depois salvar
   */
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  /**
   *
   * Uma Consulta normal
   */
  findAll() {
    return this.userRepository.find();
  }

  /**
   *
   * Consultando registro pelo email (CPF/CNPJ)
   * Integrado com o JWT
   */
  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(email: string) {
    console.log(typeof email);
    return this.userRepository.delete({ email });
  }
}
