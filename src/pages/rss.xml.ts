import rss from '@astrojs/rss';
import { getPosts } from '../lib/db';
import { SITE_URL } from '../config';

export async function GET() {
  const posts = await getPosts();

  return rss({
    title: 'Quite Fragments • Blog Feed',
    description: 'Words that linger',
    site: SITE_URL ?? 'https://quitefragments.vercel.app',
    items: posts.map(post => ({
      title: post.title,
      pubDate: new Date(post.created_date),
      link: `/writing/${post.slug}`,
    })),
  });
}
