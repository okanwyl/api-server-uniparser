import { resourceLimits } from "worker_threads";
import databaseSource from "../database";
import { Instructor } from "../entity/Instructor";
import { Publication } from "../entity/Publication";

// Initialize repository.
const instructorRepository = databaseSource.getRepository(Instructor);

class InstructorRepository {
  async createInstructor(input: Partial<Instructor>): Promise<Instructor> {
    return await instructorRepository.save(instructorRepository.create(input));
  }

  async findInstructorByID(id: number): Promise<Instructor | null> {
    return await instructorRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        university: true,
        courses: true,
        publications: true
      }
    });
  }

  async getInstructorCountByUniversityID(universityId: number): Promise<number> {
    const queryResult = await instructorRepository
      .createQueryBuilder('instructor')
      .select('COUNT(instructor.id)', 'count')
      .where('instructor.universityId = :universityId', { universityId })
      .cache(30000)
      .getRawOne();


    const instructorCount = parseInt(queryResult.count, 10);
    return instructorCount;


  }

  async getParseableInstructorCount(): Promise<number> {
    const t = 1;
    const queryResult = await instructorRepository
      .createQueryBuilder('instructor')
      .select('COUNT(instructor.id)', 'count')
      .where('instructor.parsable = :t', { t })
      .cache(30000)
      .getRawOne();
    const instructorCount = parseInt(queryResult.count, 10);
    return instructorCount;


  }

  async getNotParseableInstructorCount(): Promise<number> {
    const t = 0;
    const queryResult = await instructorRepository
      .createQueryBuilder('instructor')
      .select('COUNT(instructor.id)', 'count')
      .where('instructor.parsable = :t', { t })
      .cache(30000)
      .getRawOne();
    const instructorCount = parseInt(queryResult.count, 10);
    return instructorCount;
  }



  async getMostCitedUserIndex(id: number): Promise<number | undefined> {
    const queryResult = await instructorRepository
      .createQueryBuilder("instructor")
      .select("placement")
      .from(qb => {
        return qb
          .select("instructor.id", "id")
          .addSelect("ROW_NUMBER() OVER (ORDER BY instructor.citedby DESC)", "placement")
          .from(Instructor, "instructor")
          .orderBy("instructor.citedby", "DESC");
      }, "rankedInstructors")
      .where("rankedInstructors.id = :id", { id: id })
      .getRawOne();

    if (queryResult.placement) {
      const idx = parseInt(queryResult.placement, 10);
      return idx;

    }
    return undefined;
  }


  async getMostPublicationsCount(id: number): Promise<number | undefined> {
    const queryResult = await instructorRepository
      .createQueryBuilder()
      .select("instructor.id, COUNT(publication.id) AS publicationCount")
      .from(Instructor, "instructor")
      .leftJoin(Publication, "publication", "publication.instructorId = instructor.id")
      .groupBy("instructor.id")
      .orderBy("publicationCount", "DESC")
      .getRawMany();


    const instructorIds = queryResult.map(result => result.id);
    const placement = instructorIds.indexOf(id) + 1;

    return placement || undefined;


  }


  async getAllInstructors(): Promise<Instructor[]> {
    return await instructorRepository.find({ cache: true });
  }
}

export default new InstructorRepository();
