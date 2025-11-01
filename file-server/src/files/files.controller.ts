import { BadRequestException, Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import type { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('files')
export class FilesController {
    constructor(private readonly fileservice: FilesService) { }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
                ],
                fileIsRequired: true,
            })
        )
        file: Express.Multer.File,
        @Body() uploadFileDto: UploadFileDto,
    ): Promise<any> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        console.log('Received file:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        });

        return this.fileservice.uploadFile(file, uploadFileDto)
    }


    @Get()
    async getAllFiles(): Promise<any> {
        return this.fileservice.getAllFiles();
    }

    @Get(':id')
    async getFileMetadata(@Param('id') id: string): Promise<any> {
        return this.fileservice.getFileMetadata(id);
    }

    @Get(':id/download')
    async downloadFile(@Param('id') id: string, @Res() res: Response) {
        const { buffer, file } = await this.fileservice.downloadFile(id);

        res.set({
            'Content-Type': file.mimetype,
            'Content-Disposition': `attachment; filename="${file.originalName}"`,
            'Content-Length': file.size,
        });

        res.send(buffer);
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: string): Promise<any> {
        await this.fileservice.deleteFile(id);
        return { message: 'File deleted successfully' };
    }
}
