import databaseSource from "../database";
import { University } from "../entity/University";
import UniversityRepository from "../repository/UniversityRepository";

class UniversityService {
  async createUniversityServiceOrFail(
    input: Partial<University>
  ): Promise<University> {
    // Check the university does exist
    return await UniversityRepository.createUniversity(input);
  }

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
}

export default new UniversityService();
