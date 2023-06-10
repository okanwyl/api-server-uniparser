import { Instructor } from "../entity/Instructor";
import InstructorRepository from "../repository/InstructorRepository";
import { InstructorNotFound } from "../types/Errors";

class InstructorService {
  async createInstructorServiceOrFail(
    input: Partial<Instructor>
  ): Promise<Instructor> {
    return await InstructorRepository.createInstructor(input);
  }

  async findInstructorByIDOrFail(id: number): Promise<Instructor> {
    const checked = await InstructorRepository.findInstructorByID(id);

    if (!checked) {
      throw new InstructorNotFound("University already exist");
    }
    return checked;
  }

  async findInstructorCountByUniversityID(id: number): Promise<number> {
    const count = await InstructorRepository.getInstructorCountByUniversityID(id);

    return count;
  }

  async getAllCourses() {
    return await InstructorRepository.getAllInstructors();
  }
}

export default new InstructorService();
