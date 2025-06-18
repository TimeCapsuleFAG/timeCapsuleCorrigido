import { DataSource } from 'typeorm';
import * as path from 'path';
import { User } from '../entities/user.entity';
import { Capsule } from 'src/entities/capsule.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'llwk20051',
  database: 'timeCapsule',
  entities: [User, Capsule],
  migrations: [path.resolve(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
});
