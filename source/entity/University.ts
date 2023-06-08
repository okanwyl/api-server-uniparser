import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Course } from "./Course";
import { Instructor } from "./Instructor";
import { Publication } from "./Publication";

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

  @OneToMany(() => Course, (course) => course.university, {
    cascade: true,
  })
  courses!: Course[];

  @OneToMany(() => Instructor, (instructor) => instructor.university, {
    cascade: true,
  })
  instructors!: Instructor[];

  @OneToMany(() => Publication, (publication) => publication.university, {
    cascade: true,
  })
  publications!: Publication[];

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
