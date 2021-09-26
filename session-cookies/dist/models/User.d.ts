import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: number;
    username: string | undefined;
    password: string;
    created_at: Date;
}
