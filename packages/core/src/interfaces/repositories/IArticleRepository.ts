import { Article } from '../../domain/entities/Article';

export interface IArticleRepository {
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findAll(filters?: { status?: 'DRAFT' | 'PUBLISHED' }): Promise<Article[]>;
  save(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article>;
  update(id: string, article: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<boolean>;
}
