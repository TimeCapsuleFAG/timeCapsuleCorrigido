// src/entities/capsule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Capsule {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  titulo: string;

  @Column()
  conteudo: string;

  @Column()
  dataAbertura: Date;

  @Column({ nullable: true })
  imagem: string;

  @Column({ nullable: true })
  audio: string;

  @Column({ type: 'enum', enum: ['pessoal', 'familia', 'trabalho', 'meta', 'viagem'], default: 'pessoal' })
  categoria: string;

  @ManyToOne(() => User, (user) => user.capsules)
  usuario: User;
}
