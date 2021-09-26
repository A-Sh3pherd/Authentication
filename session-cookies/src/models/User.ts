import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", unique: true })
    username!: string | undefined;

    @Column({ type: "text" })
    password!: string;

    @CreateDateColumn()
    created_at!: Date;
}