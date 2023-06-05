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

  async getAllInstructors(): Promise<Instructor[]> {
    return await instructorRepository.find({});
  }
}

export default new InstructorRepository();
