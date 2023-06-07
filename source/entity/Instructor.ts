import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { University } from "./University";
import { Course } from "./Course";

@Entity("instructors")
export class Instructor extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ default: "", nullable: true })
  scholar_id!: string;

  @Column({ nullable: true, default: " ", length: 5000 })
  profile_picture!: string;

  @Column({ unique: true })
  filtered_name!: string;

  @Column({ default: "", nullable: true })
  titled_name!: string;

  @Column({ nullable: true, default: "", length: 5000 })
  interests!: string;

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

  @ManyToMany(() => Course)
  @JoinTable()
  courses!: Course[];

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
