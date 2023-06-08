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
import { Instructor } from "./Instructor";

@Entity("publications")
export class Publication extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ default: "", nullable: true })
  title!: string;

  @Column({ default: "", nullable: true })
  citation!: string;

  @Column({ default: "", nullable: true })
  author_pub_id!: string;

  @Column({ default: 0 })
  num_citations!: number;

  @ManyToOne(
    () => Instructor,
    (instructor: Instructor) => instructor.publications
  )
  instructor!: Instructor;

  @ManyToOne(
    () => University,
    (university: University) => university.publications
  )
  university!: University;

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
