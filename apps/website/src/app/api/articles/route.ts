import { NextResponse } from 'next/server';
import { GetActiveArticles } from '@adventure/core';
import { DrizzleArticleRepository } from '../../../infrastructure/repositories/DrizzleArticleRepository';

export const runtime = 'edge';
export const revalidate = 0; // Fresh content every time (SSR)

export async function GET() {
  try {
    const articleRepo = new DrizzleArticleRepository();
    const useCase = new GetActiveArticles(articleRepo);
    const articlesList = await useCase.execute();

    return NextResponse.json({
      success: true,
      data: articlesList
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.'
    }, { status: 500 });
  }
}
