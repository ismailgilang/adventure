import { IArticleRepository } from '../../interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';
export declare class GetActiveArticles {
    private articleRepository;
    constructor(articleRepository: IArticleRepository);
    execute(): Promise<Article[]>;
}
