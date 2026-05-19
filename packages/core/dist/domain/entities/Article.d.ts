export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    status: 'DRAFT' | 'PUBLISHED';
    createdAt: Date;
    updatedAt: Date;
}
