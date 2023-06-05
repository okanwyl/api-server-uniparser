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

@Entity("instructors")
export class Instructor extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ unique: true })
  scholar_id!: string;

  @Column("longtext")
  profile_picture!: string;

  @Column()
  name!: string;

  @Column({ default: "Not available" })
  title!: string;

  @Column("text", { nullable: true })
  interests!: string[];

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
    default: 0,
  })
  citedby!: number;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
    default: 0,
  })
  citedby5y!: number;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
    default: 0,
  })
  hindex!: number;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
    default: 0,
  })
  hindex5y!: number;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
    default: 0,
  })
  i10index!: number;

  @Column({
    type: "int",
    unsigned: true,
    nullable: true,
    default: 0,
  })
  i10index5y!: number;

  @ManyToOne(
    () => University,
    (university: University) => university.instructors
  )
  university!: University;

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
