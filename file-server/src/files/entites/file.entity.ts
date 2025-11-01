import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    originalName: string;
  
    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;
  
    @Column()
    path: string;

    @CreateDateColumn()
    uploadedAt: Date;

    @Column({ nullable: true })
    description?:string;
}

