import { IArticleRepository } from '../../interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';

export class GetActiveArticles {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(): Promise<Article[]> {
    return this.articleRepository.findAll({ status: 'PUBLISHED' });
  }
}
