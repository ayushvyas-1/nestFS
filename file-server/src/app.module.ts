import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './files/entites/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('database.database'),
        entities: [FileEntity],
        synchronize: configService.get('database.syncronize'),
        logging: configService.get('database.logging'),
      }),
    }),
    FilesModule]
  })
export class AppModule {}
