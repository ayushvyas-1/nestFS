import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entites/file.entity';
import { LocalStorageService } from './storage/local-storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]),
  MulterModule.register({
    storage: memoryStorage(),
  })],
  controllers: [FilesController],
  providers: [FilesService, LocalStorageService]
})
export class FilesModule { }
