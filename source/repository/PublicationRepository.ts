import databaseSource from "../database";
import { Publication } from "../entity/Publication";

const publicationRepository = databaseSource.getRepository(Publication);

class PublicationRepository {
  async createPublication(input: Partial<Publication>): Promise<Publication> {
    return await publicationRepository.save(
      publicationRepository.create(input)
    );
  }

  async findPublicationByID(id: number): Promise<Publication | null> {
    return await publicationRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getAllPublications(): Promise<Publication[]> {
    return await publicationRepository.find({});
  }
}

export default new PublicationRepository();
