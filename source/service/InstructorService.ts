import { Instructor } from "../entity/Instructor";
import InstructorRepository from "../repository/InstructorRepository";

class InstructorService {
  async createInstructorServiceOrFail(
    input: Partial<Instructor>
  ): Promise<Instructor> {
    return await InstructorRepository.createInstructor(input);
  }

  async findInstructorByIDOrFail(id: number): Promise<Instructor> {
    const checked = await InstructorRepository.findInstructorByID(id);

    if (!checked) {
      throw new UniversityNotFound("University already exist");
    }
    return checked;
  }

  async getAllCourses() {
    return await InstructorRepository.getAllInstructors();
  }
}

export default new InstructorService();
