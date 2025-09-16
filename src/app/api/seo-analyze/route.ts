import { NextRequest } from 'next/server';
import { SEOAnalyzer } from '@/lib/utils/seoAnalyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, keyword, slug } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: title, description, and content are required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const analyzer = new SEOAnalyzer(title, description, content, {
      primaryKeyword: keyword,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-')
    });

    const analysis = analyzer.analyze();

    return new Response(
      JSON.stringify(analysis),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('SEO Analysis Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze SEO' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}