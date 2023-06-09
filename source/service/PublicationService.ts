import { Publication } from "../entity/Publication";
import PublicationRepository from "../repository/PublicationRepository";
import { PublicationNotFound } from "../types/Errors";

class PublicationService {
  async createPublicationOrFail(
    input: Partial<Publication>
  ): Promise<Publication> {
    return await PublicationRepository.createPublication(input);
  }

  async findPublicationByIDOrFail(id: number): Promise<Publication> {
    const checked = await PublicationRepository.findPublicationByID(id);

    if (!checked) {
      throw new PublicationNotFound("University already exist");
    }
    return checked;
  }

  async findPublicationCountByUniversityID(id: number): Promise<number> {
    const count = await PublicationRepository.getPublicationCountByUniversityID(
      id
    );

    return count;
  }

  async getAllPublications() {
    return await PublicationRepository.getAllPublications();
  }
  async getPublicationCount() {
    return await PublicationRepository.getPublicationCount();
  }
}

export default new PublicationService();
