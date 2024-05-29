import fs from 'node:fs'
import path from 'node:path'
import { TConfigFile } from '../types/core.js'

export const defaultDirectories = {
  input: './',
  output: './dist',
  template: './templates',
  blogs: './blogs',
}

export const defaultFiles = {
  outputIndex: 'index.html',
  outputBlog: 'blog.html',
  config: 'config.json',
  main: 'main.md',
  blog_example_1: 'blogs/first-post.md',
  blog_example_2: 'blogs/second-post.md',
}

export const directoryExists = (source: string) => {
  return fs.existsSync(source)
}

export const buildDirectory = (source: string) => {
  if (directoryExists(source)) return
  fs.mkdirSync(source, { recursive: true })
}

export const readDirectory = (source: string) => {
  return fs.readdirSync(source)
}

export const readDirectoryRecursive = (source: string) => {
  return fs.readdirSync(source, { withFileTypes: true, recursive: true })
}

export const writeFile = (source: string, content?: string) => {
  fs.writeFileSync(source, content ?? '', 'utf-8')
}

export const readFile = (source: string) => {
  try {
    return fs.readFileSync(source, 'utf-8')
  } catch (error) {
    return null
  }
}

export const joinPath = (paths: (string | null | undefined)[]): string => {
  const filteredPaths: string[] = paths.filter((p): p is string => !!p)
  return path.join(...filteredPaths)
}

export const getFilesForBuild = {
  mainPage: (config: TConfigFile) => {
    return readFile(path.join(config.inputDir, defaultFiles.main))
  },
  blogs: (config: TConfigFile) => {
    const blogs = readDirectoryRecursive(config.inputDir).filter(
      (file) => file.isFile() && file.name.endsWith('.md')
    )
    return blogs.map((blog) => readFile(joinPath([config.inputDir, blog.name])))
  },
}

export const createTagsDirectory = (source: string, tags: string[]) => {
  tags.forEach((tag) => {
    const tagDirectory = `${source}/${tag}`
    buildDirectory(tagDirectory)
  })
}
