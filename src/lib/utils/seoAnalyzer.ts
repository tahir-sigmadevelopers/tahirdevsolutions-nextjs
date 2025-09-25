export interface SEOAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  details: {
    title: {
      length: number;
      status: 'good' | 'warning' | 'bad';
    };
    metaDescription: {
      length: number;
      status: 'good' | 'warning' | 'bad';
    };
    keyword: {
      inTitle: boolean;
      inMetaDescription: boolean;
      inUrl: boolean;
      inFirstParagraph: boolean;
      density: number;
      status: 'good' | 'warning' | 'bad';
    };
    headings: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
      status: 'good' | 'warning' | 'bad';
    };
    links: {
      internal: number;
      external: number;
      status: 'good' | 'warning' | 'bad';
    };
    images: {
      withAlt: number;
      withoutAlt: number;
      total: number;
      status: 'good' | 'warning' | 'bad';
    };
    readability: {
      score: number;
      grade: string;
      status: 'good' | 'warning' | 'bad';
    };
  };
}

export interface SEOAnalyzerOptions {
  primaryKeyword?: string;
  slug?: string;
}

export class SEOAnalyzer {
  private content: string;
  private title: string;
  private metaDescription: string;
  private options: SEOAnalyzerOptions;

  constructor(
    title: string,
    metaDescription: string,
    content: string,
    options: SEOAnalyzerOptions = {}
  ) {
    this.title = title;
    this.metaDescription = metaDescription;
    this.content = content;
    this.options = options;
  }

  public analyze(): SEOAnalysisResult {
    const titleAnalysis = this.analyzeTitle();
    const metaDescriptionAnalysis = this.analyzeMetaDescription();
    const keywordAnalysis = this.analyzeKeyword();
    const headingAnalysis = this.analyzeHeadings();
    const linkAnalysis = this.analyzeLinks();
    const imageAnalysis = this.analyzeImages();
    const readabilityAnalysis = this.analyzeReadability();

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Collect issues and recommendations
    if (titleAnalysis.status !== 'good') {
      issues.push(`Title length should be 50-60 characters (currently ${titleAnalysis.length})`);
      recommendations.push('Optimize your title length to be between 50-60 characters for better SEO');
    }

    if (metaDescriptionAnalysis.status !== 'good') {
      issues.push(`Meta description should be 120-160 characters (currently ${metaDescriptionAnalysis.length})`);
      recommendations.push('Keep your meta description between 120-160 characters for optimal search visibility');
    }

    if (keywordAnalysis.status !== 'good') {
      if (!keywordAnalysis.inTitle) {
        issues.push('Primary keyword not found in title');
        recommendations.push('Include your primary keyword in the title');
      }
      if (!keywordAnalysis.inMetaDescription) {
        issues.push('Primary keyword not found in meta description');
        recommendations.push('Include your primary keyword in the meta description');
      }
      if (!keywordAnalysis.inUrl) {
        issues.push('Primary keyword not found in URL');
        recommendations.push('Include your primary keyword in the URL slug');
      }
      if (!keywordAnalysis.inFirstParagraph) {
        issues.push('Primary keyword not found in first paragraph');
        recommendations.push('Include your primary keyword in the first paragraph of your content');
      }
      if (keywordAnalysis.density < 1 || keywordAnalysis.density > 2) {
        issues.push(`Keyword density should be 1-2% (currently ${keywordAnalysis.density.toFixed(1)}%)`);
        recommendations.push('Adjust keyword density to be between 1-2% for optimal SEO');
      }
    }

    if (headingAnalysis.status !== 'good') {
      if (headingAnalysis.h1Count !== 1) {
        issues.push(`Use exactly one H1 tag (currently ${headingAnalysis.h1Count})`);
        recommendations.push('Use exactly one H1 tag for your main title');
      }
      if (headingAnalysis.h2Count === 0) {
        issues.push('No H2 headings found');
        recommendations.push('Add H2 headings to structure your content');
      }
    }

    if (linkAnalysis.status !== 'good') {
      if (linkAnalysis.internal === 0) {
        issues.push('No internal links found');
        recommendations.push('Add internal links to other relevant content on your site');
      }
      if (linkAnalysis.external === 0) {
        issues.push('No external links found');
        recommendations.push('Add external links to authoritative sources');
      }
    }

    if (imageAnalysis.status !== 'good') {
      if (imageAnalysis.withoutAlt > 0) {
        issues.push(`${imageAnalysis.withoutAlt} images missing alt tags`);
        recommendations.push('Add descriptive alt tags to all images');
      }
    }

    if (readabilityAnalysis.status !== 'good') {
      issues.push(`Readability score is ${readabilityAnalysis.score.toFixed(1)} (${readabilityAnalysis.grade})`);
      recommendations.push('Improve readability by using shorter sentences and simpler words');
    }

    // Calculate overall score (0-100)
    const score = this.calculateScore(
      titleAnalysis,
      metaDescriptionAnalysis,
      keywordAnalysis,
      headingAnalysis,
      linkAnalysis,
      imageAnalysis,
      readabilityAnalysis
    );

    return {
      score,
      issues,
      recommendations,
      details: {
        title: titleAnalysis,
        metaDescription: metaDescriptionAnalysis,
        keyword: keywordAnalysis,
        headings: headingAnalysis,
        links: linkAnalysis,
        images: imageAnalysis,
        readability: readabilityAnalysis,
      },
    };
  }

  private analyzeTitle() {
    const length = this.title.length;
    let status: 'good' | 'warning' | 'bad' = 'good';
    
    if (length < 50 || length > 60) {
      status = length < 30 || length > 70 ? 'bad' : 'warning';
    }
    
    return { length, status };
  }

  private analyzeMetaDescription() {
    const length = this.metaDescription.length;
    let status: 'good' | 'warning' | 'bad' = 'good';
    
    if (length < 120 || length > 160) {
      status = length < 100 || length > 180 ? 'bad' : 'warning';
    }
    
    return { length, status };
  }

  private analyzeKeyword() {
    if (!this.options.primaryKeyword) {
      return {
        inTitle: false,
        inMetaDescription: false,
        inUrl: false,
        inFirstParagraph: false,
        density: 0,
        status: 'good' as const,
      };
    }

    const keyword = this.options.primaryKeyword.toLowerCase();
    const title = this.title.toLowerCase();
    const metaDescription = this.metaDescription.toLowerCase();
    const content = this.content.toLowerCase();
    const slug = this.options.slug?.toLowerCase() || '';

    // Check presence in different elements
    const inTitle = title.includes(keyword);
    const inMetaDescription = metaDescription.includes(keyword);
    const inUrl = slug.includes(keyword.replace(/\s+/g, '-'));
    
    // Check in first paragraph (first 200 words)
    const firstParagraph = content.substring(0, 1000);
    const inFirstParagraph = firstParagraph.includes(keyword);

    // Calculate keyword density
    const wordCount = this.getWordCount(content);
    const keywordCount = (content.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    // Determine status
    const hasKeywordIssues = !inTitle || !inMetaDescription || !inUrl || !inFirstParagraph || 
                            density < 1 || density > 2;
    const status = hasKeywordIssues ? ('warning' as const) : ('good' as const);

    return {
      inTitle,
      inMetaDescription,
      inUrl,
      inFirstParagraph,
      density,
      status,
    };
  }

  private analyzeHeadings() {
    // Simple regex-based heading analysis
    const h1Matches = (this.content.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length;
    const h2Matches = (this.content.match(/<h2[^>]*>.*?<\/h2>/gi) || []).length;
    const h3Matches = (this.content.match(/<h3[^>]*>.*?<\/h3>/gi) || []).length;

    // Determine status
    const hasH1Issues = h1Matches !== 1;
    const hasH2Issues = h2Matches === 0;
    const status = hasH1Issues || hasH2Issues ? ('warning' as const) : ('good' as const);

    return {
      h1Count: h1Matches,
      h2Count: h2Matches,
      h3Count: h3Matches,
      status,
    };
  }

  private analyzeLinks() {
    // Simple regex-based link analysis
    const internalLinks = (this.content.match(/<a[^>]*href\s*=\s*["'][^"']*\/[^"']*["'][^>]*>/gi) || []).length;
    const externalLinks = (this.content.match(/<a[^>]*href\s*=\s*["'](https?:)?\/\/(?!localhost)[^"']*["'][^>]*>/gi) || []).length;

    // Determine status
    const hasLinkIssues = internalLinks === 0 || externalLinks === 0;
    const status = hasLinkIssues ? ('warning' as const) : ('good' as const);

    return {
      internal: internalLinks,
      external: externalLinks,
      status,
    };
  }

  private analyzeImages() {
    // Find all images
    const allImages = (this.content.match(/<img[^>]*>/gi) || []).length;
    
    // Find images with alt tags
    const imagesWithAlt = (this.content.match(/<img[^>]*alt\s*=\s*["'][^"']*["'][^>]*>/gi) || []).length;
    
    const imagesWithoutAlt = allImages - imagesWithAlt;
    
    // Determine status
    const status = imagesWithoutAlt > 0 ? ('warning' as const) : ('good' as const);

    return {
      withAlt: imagesWithAlt,
      withoutAlt: imagesWithoutAlt,
      total: allImages,
      status,
    };
  }

  private analyzeReadability() {
    const content = this.stripHtml(this.content);
    const wordCount = this.getWordCount(content);
    const sentenceCount = this.getSentenceCount(content);
    const syllableCount = this.getSyllableCount(content);

    // Flesch-Kincaid Grade Level formula
    let score = 0;
    let grade = 'Unknown';
    let status: 'good' | 'warning' | 'bad' = 'good';

    if (wordCount > 0 && sentenceCount > 0) {
      // Flesch-Kincaid Grade Level = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
      score = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
      
      if (score <= 8) {
        grade = 'Easy (6th grade or below)';
      } else if (score <= 10) {
        grade = 'Fairly easy (7th-8th grade)';
      } else if (score <= 12) {
        grade = 'Plain English (9th-10th grade)';
      } else if (score <= 16) {
        grade = 'Fairly difficult (11th-12th grade)';
      } else {
        grade = 'Difficult (College level)';
      }
      
      // Consider difficult content as warning
      if (score > 12) {
        status = 'warning' as const;
      }
    }

    return {
      score: Math.max(0, score),
      grade,
      status,
    };
  }

  private getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private getSentenceCount(text: string): number {
    return (text.match(/[.!?]+/g) || []).length || 1;
  }

  private getSyllableCount(text: string): number {
    // Simplified syllable counting
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    let syllableCount = 0;
    
    for (const word of words) {
      // Very basic syllable estimation
      syllableCount += Math.max(1, Math.floor(word.length / 4) + 1);
    }
    
    return syllableCount;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ');
  }

  private calculateScore(...analyses: { status: 'good' | 'warning' | 'bad' }[]): number {
    let score = 100;
    
    for (const analysis of analyses) {
      switch (analysis.status) {
        case 'bad':
          score -= 15;
          break;
        case 'warning':
          score -= 8;
          break;
        case 'good':
        default:
          // No deduction for good status
          break;
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }
}