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
    return await publicationRepository.find({ cache: true });
  }

  async getPublicationCountByUniversityID(universityId: number): Promise<number> {
    const queryResult = await publicationRepository
      .createQueryBuilder('instructor')
      .select('COUNT(instructor.id)', 'count')
      .where('instructor.universityId = :universityId', { universityId })
      .cache(30000)
      .getRawOne();


    const instructorCount = parseInt(queryResult.count, 10);
    return instructorCount;

  }

  async getPublicationCount(): Promise<number> {
    const queryResult = await publicationRepository
      .createQueryBuilder('publication')
      .select('COUNT(publication.id)', 'count')
      .cache(30000)
      .getRawOne();

    const publicationCount = parseInt(queryResult.count, 10);
    return publicationCount;

  }

}

export default new PublicationRepository();
