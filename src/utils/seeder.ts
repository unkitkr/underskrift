import { TBlogSeeder } from '../types/core.js'
import { defaultDirectories, sluggify } from './index.js'

export const mainPageSeeder = `---
Name: Your Name
Email: Your Email
Bio: Your short Bio
---

Write your whole bio here
`

export const blogPageSeeder = (content: TBlogSeeder) => `---
Title: Your Title ${content.title}
Description: ${content.description ?? 'Your Description'} 
Tags: ${content.tags ?? '[Your Tags in an array]'}  
OgImage: ${content.ogImage ?? 'URL to your OG Image'} 
OgTitle : ${content.ogTitle ?? 'Title placeholder for your OG Title'}
OgDescription: ${content.ogDescription ?? 'Description placeholder for your OG'}
Date: ${content.date ?? new Date().toISOString() ?? 'Date of publishing'}
Author: ${content.author ?? 'Author Name'}
slug: ${
  content.slug ? `${sluggify(content.slug)}` : `${sluggify(content.title)}`
}
---

Your Blog Content Here
`

export const configSeeder = {
  inputDir: defaultDirectories.input,
  outputDir: defaultDirectories.output,
  templateDir: defaultDirectories.template,
  navItems: [
    {
      title: 'Home',
      url: '/',
    },
    {
      title: 'Blog',
      url: '/blog',
    },
    {
      title: 'About',
      url: '/about',
    },
  ],
  siteTitle: 'Your Site Title',
  siteFavicon: 'URL to your favicon',
  socials: [
    {
      name: 'Twitter',
      url: 'https://twitter.com/your-twitter',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/your-github',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/your-linkedin',
    },
    {
      name: 'Website',
      url: 'https://your-website.com',
    },
  ],
  blogs: [],
}
