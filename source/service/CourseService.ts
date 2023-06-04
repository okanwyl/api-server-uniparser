import { Course } from "../entity/Course";
import CourseRepository from "../repository/CourseRepository";

class CourseService {
  async createCourseServiceOrFail(input: Partial<Course>): Promise<Course> {
    return await CourseRepository.createCourse(input);
  }

  async findCourseByIDOrFail(id: number): Promise<Course> {
    const checked = await CourseRepository.findCourseByID(id);

    if (!checked) {
      throw new UniversityNotFound("University already exist");
    }
    return checked;
  }

  async getAllCourses() {
    return await CourseRepository.getAllCourses();
  }
}

export default new CourseService();
