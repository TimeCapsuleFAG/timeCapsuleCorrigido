import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Capsule } from './entities/capsule.entity';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { CapsuleModule } from './capsule/capsule.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'llwk20051',
      database: 'timeCapsule',
      entities: [User, Capsule], // <-- Aqui
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Capsule]),
    UserModule,
    CapsuleModule,
    AuthModule,
  ],
})
export class AppModule {}
