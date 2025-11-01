export interface IStorageService {
    saveFile(file: Express.Multer.File):Promise<string>;
    getFile(filename: string): Promise<any>;
    deleteFile(filename:string): Promise<void>;
    getFilePath(filename: string): string;
}