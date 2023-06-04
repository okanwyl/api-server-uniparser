import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("courses")
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("longtext")
  name!: string;

  @Column()
  code!: string;

  @Column("longtext")
  info!: string;

  @Column({})
  href!: string;

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}

// TODO: Instructor, organizaton
