import databaseSource from "../database";
import { Course } from "../entity/Course";
import { Instructor } from "../entity/Instructor";

// Initialize repository.
const courseRepository = databaseSource.getRepository(Course);
const instructorRepository = databaseSource.getRepository(Instructor);

class CourseRepository {
  async createCourse(input: Partial<Course>): Promise<Course> {
    return await courseRepository.save(courseRepository.create(input));
  }

  async findCourseByID(id: number): Promise<Course | null> {
    const course = await courseRepository.findOne({
      where: {
        id: id,
      },
    });

    if (course !== null) {
      const instructors = await instructorRepository
        .createQueryBuilder("instructor")
        .innerJoin("instructor.courses", "course")
        .where("course.id = :id", { id: course.id })
        .getMany();
      // @ts-ignore
      course["instructors"] = instructors;
    }
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await courseRepository.find({});
  }

  async getCourseCountByUniversityID(universityId: number): Promise<number> {
    const queryResult = await courseRepository
      .createQueryBuilder('course')
      .select('COUNT(course.id)', 'count')
      .where('course.universityId = :universityId', { universityId })
      .getRawOne();

    console.log(queryResult);

    const courseCount = parseInt(queryResult.count, 10);
    return courseCount;
  }
}

export default new CourseRepository();
