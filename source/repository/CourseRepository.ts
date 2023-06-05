import databaseSource from "../database";
import { Course } from "../entity/Course";

// Initialize repository.
const courseRepository = databaseSource.getRepository(Course);

class CourseRepository {
  async createCourse(input: Partial<Course>): Promise<Course> {
    return await courseRepository.save(courseRepository.create(input));
  }

  async findCourseByID(id: number): Promise<Course | null> {
    return await courseRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getAllCourses(): Promise<Course[]> {
    return await courseRepository.find({});
  }
}

export default new CourseRepository();
