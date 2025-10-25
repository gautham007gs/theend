import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateBlogMetadata, getAllBlogSlugs, blogPostsMetadata } from '@/lib/blog-metadata';
import BlogPostContent from '@/components/BlogPostContent';

type Props = {
  params: { slug: string };
};

// Generate static params for all blog posts (SSG at build time)
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO (server-side)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  if (!blogPostsMetadata[slug]) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return generateBlogMetadata(slug);
}

// Server Component - Google can crawl this!
export default async function BlogPost({ params }: Props) {
  const { slug } = params;
  
  // Validate slug exists
  if (!blogPostsMetadata[slug]) {
    notFound();
  }
  
  const metadata = blogPostsMetadata[slug];
  
  // Render the blog post content
  return (
    <BlogPostContent 
      slug={slug}
      title={metadata.title}
      author={metadata.author}
      date={metadata.datePublished}
      keywords={metadata.keywords}
      description={metadata.description}
    />
  );
}
