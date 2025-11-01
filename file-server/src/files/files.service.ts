import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalStorageService } from './storage/local-storage.service';
import { FileEntity } from './entites/file.entity';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileResponseDto } from './dto/file-response.dto';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileEntity)
        private fileRepository: Repository<FileEntity>,
        private storageService: LocalStorageService,
    ) { }

    async uploadFile(
        file: Express.Multer.File,
        uploadFileDto: UploadFileDto,
    ): Promise<any> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        console.log('Processign file upload: ', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        });
        const filename = await this.storageService.saveFile(file);
        console.log('File saved with filename:', filename);

        const fileEntity = this.fileRepository.create({
            originalName: file.originalname,
            filename,
            mimetype: file.mimetype,
            size: file.size,
            path: this.storageService.getFilePath(filename),
            description: uploadFileDto.description,
        })

        console.log('File entity before save:', fileEntity);

        const savedFile = await this.fileRepository.save(fileEntity);
        console.log('File entity after save:', savedFile);

        return this.toResponseDto(savedFile);
    }

    async getFileMetadata(id: string): Promise<any> {
        const file = await this.fileRepository.findOne({
            where: { id }
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        return this.toResponseDto(file);
    }

    async getAllFiles(): Promise<any> {
        const files = await this.fileRepository.find({
            order: { uploadedAt: 'DESC' }
        });

        return files.map(file => this.toResponseDto(file))

    }

    async downloadFile(id: string): Promise<any> {
        const file = await this.fileRepository.findOne({
            where: { id }
        })
        if (!file) {
            throw new NotFoundException('File not found');
        }

        const buffer = await this.storageService.getFile(file.filename);
        return { buffer, file };
    }

    async deleteFile(id: string): Promise<void> {
        const file = await this.fileRepository.findOne({ where: { id } })

        if (!file) {
            throw new NotFoundException('File not found');
        }

        await this.storageService.deleteFile(file.filename);
        await this.fileRepository.remove(file);

    }
    private toResponseDto(file: FileEntity): FileResponseDto {
        return {
            id: file.id,
            originalName: file.originalName,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: file.uploadedAt,
            description: file.description,
            downloadUrl: `/files/${file.id}/download`,
        };
    }
}
