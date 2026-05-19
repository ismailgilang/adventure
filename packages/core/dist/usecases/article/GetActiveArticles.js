"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveArticles = void 0;
class GetActiveArticles {
    articleRepository;
    constructor(articleRepository) {
        this.articleRepository = articleRepository;
    }
    async execute() {
        return this.articleRepository.findAll({ status: 'PUBLISHED' });
    }
}
exports.GetActiveArticles = GetActiveArticles;
