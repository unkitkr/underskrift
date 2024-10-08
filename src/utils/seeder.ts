import { TBlogSeeder } from '../types/core.js'
import { defaultDirectories, sluggify } from './index.js'

export const mainPageSeeder = `---
Bio: Your short Bio
---

Write your whole bio here`

export const blogPageSeeder = (content: TBlogSeeder) => {
  const feeder: TBlogSeeder = {
    title: content.title ?? 'Your Title',
    description: content.description ?? 'Your Description',
    tags: content.tags ?? ['Your Tags in an array'],
    ogImage: content.ogImage ?? 'URL to your OG Image',
    ogTitle: content.ogTitle ?? 'Title placeholder for your OG Title',
    ogDescription:
      content.ogDescription ?? 'Description placeholder for your OG',
    date: content.date ?? new Date().toISOString(),
    slug: content.slug ?? sluggify(content.title),
    author: content.author ?? 'Your Name',
  }
  const textContent = `---
Title: ${feeder.title}
Description: ${feeder.description} 
Tags: ${feeder.tags}  
OgImage: ${feeder.ogImage} 
OgTitle : ${feeder.ogTitle}
OgDescription: ${feeder.ogDescription}
Date: ${
    feeder.date ??
    new Date().toLocaleDateString('en-GB', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    })
  }
Author: ${feeder.author}
slug: ${feeder.slug}
---

Your Blog Content Here`

  return { textContent, content: feeder }
}

export const tagsSeeder = `
  - [Google](https://google.com)
  - [A good Blog](https://good-blog.com)
  - [Maybe something proud](https://proud.com)`

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
  personalInformation: {
    name: 'Your Name',
    email: 'Your Email',
    profilePic: 'URL to your profile picture',
    location: 'Your Location',
    shortBio: 'Your short bio',
  },
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
    {
      name: 'Resume',
      url: 'https://your-resume.com',
    },
    {
      name: 'Portfolio',
      url: 'https://your-portfolio.com',
    },
  ],
  blogs: [],
}
