import databaseSource from "../database";
import { Instructor } from "../entity/Instructor";

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



  async getAllInstructors(): Promise<Instructor[]> {
    return await instructorRepository.find({});
  }
}

export default new InstructorRepository();
