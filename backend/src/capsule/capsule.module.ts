import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capsule } from '../entities/capsule.entity';
import { User } from '../entities/user.entity';
import { CapsuleService } from './capsule.service';
import { CapsuleController } from './capsule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Capsule, User])],
  controllers: [CapsuleController],
  providers: [CapsuleService],
})
export class CapsuleModule {}
