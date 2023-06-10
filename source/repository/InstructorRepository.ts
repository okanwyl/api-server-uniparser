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

  async getAllInstructors(): Promise<Instructor[]> {
    return await instructorRepository.find({});
  }
}

export default new InstructorRepository();
