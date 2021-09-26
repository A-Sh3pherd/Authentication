import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: "text", nullable: false, unique: true })
    username: string | undefined;

    @Field(() => String)
    @Column({ type: "text", nullable: false })
    password!: string;

    @CreateDateColumn()
    created_at!: Date;
}