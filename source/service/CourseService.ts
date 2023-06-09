import { Course } from "../entity/Course";
import CourseRepository from "../repository/CourseRepository";
import { CourseNotFound } from "../types/Errors";

class CourseService {
  async createCourseServiceOrFail(input: Partial<Course>): Promise<Course> {
    return await CourseRepository.createCourse(input);
  }

  async findCourseByIDOrFail(id: number): Promise<Course> {
    const checked = await CourseRepository.findCourseByID(id);

    if (!checked) {
      throw new CourseNotFound("University already exist");
    }
    return checked;
  }

  async getAllCourses() {
    return await CourseRepository.getAllCourses();
  }

  async getAllCoursesByUniversityID(id: number) {
    return await CourseRepository.getCoursesByUniversityID(id);
  }

  async findCourseCountByUniversityID(id: number): Promise<number> {
    const count = await CourseRepository.getCourseCountByUniversityID(id);
    return count;
  }

  async getCourseCountService() {
    return await CourseRepository.getCourseCount();
  }
}

export default new CourseService();
