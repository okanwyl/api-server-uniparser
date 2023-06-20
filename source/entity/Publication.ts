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
import { PublicationType } from "./PublicationType";

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

  @Column({
    type: "enum",
    enum: PublicationType,
    default: PublicationType.OTHER,
    nullable: true,
  })
  publication_type!: PublicationType;

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
