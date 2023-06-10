import databaseSource from "../database";
import { University } from "../entity/University";
import CourseRepository from "./CourseRepository";
import InstructorRepository from "./InstructorRepository";
import PublicationRepository from "./PublicationRepository";

// Initialize repository.
const universityRepository = databaseSource.getRepository(University);

class UniversityRepository {
  async createUniversity(input: Partial<University>): Promise<University> {
    return await universityRepository.save(universityRepository.create(input));
  }

  async findUniversityByIDOrFail(id: number): Promise<University | null> {
    return await universityRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getAllUniversities(): Promise<University[]> {
    return await universityRepository.find({});
  }
}

export default new UniversityRepository();
