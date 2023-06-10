import { University } from "../entity/University";
import UniversityRepository from "../repository/UniversityRepository";
import { UniversityNotFound } from "../types/Errors";
import CourseService from "./CourseService";
import InstructorService from "./InstructorService";
import PublicationService from "./PublicationService";

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

  async findUniversityAndFetchParameters(id: number): Promise<{ instructors: number, courses: number, publications: number }> {
    const instructorCount = await InstructorService.findInstructorCountByUniversityID(id);
    const courseCount = await CourseService.findCourseCountByUniversityID(id);
    const publicationCount = await PublicationService.findPublicationCountByUniversityID(id)

    if (!instructorCount) {
      throw new UniversityNotFound("University already exist");
    }
    return { instructors: instructorCount, courses: courseCount, publications: publicationCount };

  }

  async getGlobalUniversityMetric(): Promise<{ parseable: number, notParseable: number, publicationCount: number, courseCount: number }> {
    const parseable = await InstructorService.getParseableInstructors();
    const notParseable = await InstructorService.getNotParseableInstructors();
    // Use better naming on publication service
    const publicationCount = await PublicationService.getPublicationCount();
    const courseCount = await CourseService.getCourseCountService();
    return { parseable, notParseable, publicationCount, courseCount };

  }
}

export default new UniversityService();
