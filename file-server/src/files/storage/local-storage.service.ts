import { Injectable, NotFoundException } from "@nestjs/common";
import { IStorageService } from "./storage.service";
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from "@nestjs/config";
/*
In future if want to store files in S3 or other providers, just create a service which implements IStorageService 
*/
@Injectable()
export class LocalStorageService implements IStorageService {
    private uploadPath: string;

    constructor(private configService: ConfigService) {
        this.uploadPath = this.configService.get('storage.uploadPath')!;
        this.ensureUploadDir()
    }
    // ensures directory to store the file exists. if nnot creates directory.
    private async ensureUploadDir() {
        try {
            await fs.access(this.uploadPath);
        } catch {
            await fs.mkdir(this.uploadPath, { recursive: true });
        }
    }

    //creats name and writes the file in system.
    async saveFile(file: Express.Multer.File): Promise<string> {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(this.uploadPath, filename);
        console.log("upload filepath",filepath)

        await fs.writeFile(filepath, file.buffer);

        return filename
    }
    
    async getFile(filename: string): Promise<any> {
        const filepath = this.getFilePath(filename);
        console.log(filepath);

        try {
            return await fs.readFile(filepath);
        } catch (error) {
            throw new NotFoundException('File not found');
        }
    }

    async deleteFile(filename: string): Promise<void> {
        const filepath = this.getFilePath(filename);
        try {
            await fs.unlink(filepath);
        } catch (error) {
            throw new NotFoundException('file not found');
        }
    }

    getFilePath(filename: string): string {
        return path.join(this.uploadPath, filename);
    }

}