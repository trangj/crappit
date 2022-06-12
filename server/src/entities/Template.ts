import {
  PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity,
} from 'typeorm';

export abstract class Template extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @CreateDateColumn()
    created_at: Date;

  @UpdateDateColumn()
    updated_at: Date;
}
