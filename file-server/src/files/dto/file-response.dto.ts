export class FileResponseDto {
    id: string;
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    uploadedAt: Date;
    description?: string;
    downloadUrl: string;
}