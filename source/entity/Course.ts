import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { University } from "./University";

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

  @ManyToOne(() => University, (university: University) => university.courses)
  university!: University;

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
