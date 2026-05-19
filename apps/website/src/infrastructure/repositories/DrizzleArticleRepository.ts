import { IArticleRepository, Article } from '@adventure/core';
import { db, articles, eq } from '@adventure/database';

export class DrizzleArticleRepository implements IArticleRepository {
  async findById(id: string): Promise<Article | null> {
    const results = await db.select().from(articles).where(eq(articles.id, id));
    if (results.length === 0) return null;
    return this.mapToDomain(results[0]);
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const results = await db.select().from(articles).where(eq(articles.slug, slug));
    if (results.length === 0) return null;
    return this.mapToDomain(results[0]);
  }

  async findAll(filters?: { status?: 'DRAFT' | 'PUBLISHED' }): Promise<Article[]> {
    let query = db.select().from(articles);
    if (filters?.status) {
      // @ts-ignore
      query = query.where(eq(articles.status, filters.status));
    }
    const results = await query;
    return results.map(this.mapToDomain);
  }

  async save(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    const results = await db.insert(articles).values({
      title: article.title,
      slug: article.slug,
      content: article.content,
      imageUrl: article.imageUrl || null,
      status: article.status
    }).returning();
    return this.mapToDomain(results[0]);
  }

  async update(id: string, article: Partial<Article>): Promise<Article> {
    const results = await db.update(articles).set({
      title: article.title,
      slug: article.slug,
      content: article.content,
      imageUrl: article.imageUrl,
      status: article.status,
      updatedAt: new Date()
    }).where(eq(articles.id, id)).returning();
    return this.mapToDomain(results[0]);
  }

  async delete(id: string): Promise<boolean> {
    const results = await db.delete(articles).where(eq(articles.id, id)).returning();
    return results.length > 0;
  }

  private mapToDomain(dbRecord: any): Article {
    return {
      id: dbRecord.id,
      title: dbRecord.title,
      slug: dbRecord.slug,
      content: dbRecord.content,
      imageUrl: dbRecord.imageUrl || undefined,
      status: dbRecord.status as 'DRAFT' | 'PUBLISHED',
      createdAt: dbRecord.createdAt,
      updatedAt: dbRecord.updatedAt
    };
  }
}
