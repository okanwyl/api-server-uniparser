import databaseSource from "../database";
import { University } from "../entity/University";

// Custom errors.
class AlreadyExistUniversity extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "AlreadyExistUniversity";
  }
}

class UniversityNotFound extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "UniversityNotFound";
  }
}

// Initialize repository.
const universityRepository = databaseSource.getRepository(University);

class UniversityService {
  private universityRepository = databaseSource.getRepository(University);
  async createUniversityServiceOrFail(
    input: Partial<University>
  ): Promise<University> {
    // Check the university does exist
    const checked = await universityRepository.findOne({
      where: {
        name: input.name,
      },
    });

    if (!checked) {
      throw new AlreadyExistUniversity("University already exist");
    }
    return await universityRepository.save(universityRepository.create(input));
  }

  async findUniversityByIDOrFail(id: number): Promise<University> {
    const checked = await universityRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!checked) {
      throw new UniversityNotFound("University already exist");
    }
    return checked;
  }

  async getAllUniversities() {
    return await universityRepository.find({});
  }
}

export default new UniversityService();
