import { University } from "../entity/University";
import UniversityRepository from "../repository/UniversityRepository";
import { UniversityNotFound } from "../types/Errors";
import CourseService from "./CourseService";
import InstructorService from "./InstructorService";

class UniversityService {
  async findUniversityByIDOrFail(id: number): Promise<University> {
    const checked = await UniversityRepository.findUniversityByIDOrFail(id);

    if (!checked) {
      throw new UniversityNotFound("University already exist");
    }
    return checked;
  }

  async getAllUniversities() {
    return await UniversityRepository.getAllUniversities();
  }

  async findUniversityAndFetchParameters(id: number): Promise<{ instructorCount: number, courseCount: number }> {
    const instructorCount = await InstructorService.findInstructorCountByUniversityID(id);
    const courseCount = await CourseService.findCourseCountByUniversityID(id);
    console.log(courseCount);

    if (!instructorCount) {
      throw new UniversityNotFound("University already exist");
    }
    return { instructorCount, courseCount };

  }
}

export default new UniversityService();
