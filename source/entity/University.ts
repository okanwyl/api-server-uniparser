import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("universities")
export class University extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({
    unique: true,
  })
  name!: string;

  @Column({
    unique: true,
  })
  initials!: string;

  @Column({
    unique: true,
  })
  href!: string;

  @Column({
    unique: true,
  })
  scholar!: string;

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}