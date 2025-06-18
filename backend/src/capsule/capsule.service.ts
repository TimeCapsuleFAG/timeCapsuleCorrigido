import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capsule } from '../entities/capsule.entity';
import { User } from '../entities/user.entity';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';

@Injectable()
export class CapsuleService {
  constructor(
    @InjectRepository(Capsule)
    private capsuleRepository: Repository<Capsule>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCapsuleDto: CreateCapsuleDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');
    const dataAbertura = createCapsuleDto.dataAbertura ? new Date(createCapsuleDto.dataAbertura) : new Date();
    const capsule = this.capsuleRepository.create({
      ...createCapsuleDto,
      dataAbertura,
      usuario: user,
    });
    return this.capsuleRepository.save(capsule);
  }

  async findAll(userId: string) {
    const capsules = await this.capsuleRepository.find({
      where: { usuario: { id: userId } },
      relations: ['usuario'],
      order: { dataAbertura: 'DESC' },
    });
    const now = new Date();
    // Adiciona campos padronizados para o frontend
    return {
      data: capsules.map(capsule => ({
        id: capsule.id,
        titulo: capsule.titulo,
        conteudo: capsule.conteudo,
        dataAbertura: capsule.dataAbertura,
        categoria: capsule.categoria,
        imagem: capsule.imagem,
        audio: capsule.audio,
        status: now >= capsule.dataAbertura ? 'aberta' : 'fechada',
        createdAt: capsule['createdAt'] || capsule.dataAbertura, // fallback
      })),
    };
  }

  async findOne(id: string, userId: string) {
    const capsule = await this.capsuleRepository.findOne({
      where: { id, usuario: { id: userId } },
      relations: ['usuario'],
    });
    if (!capsule) throw new Error('Cápsula não encontrada');
    const now = new Date();
    if (now < capsule.dataAbertura) {
      return { mensagem: 'Cápsula ainda não pode ser aberta', status: 'fechada' };
    }
    return { ...capsule, status: 'aberta' };
  }

  update(id: number, updateCapsuleDto: UpdateCapsuleDto) {
    return `This action updates a #${id} capsule`;
  }

  remove(id: number) {
    return `This action removes a #${id} capsule`;
  }
}
