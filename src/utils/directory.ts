import fs from 'node:fs'

export const defaultDirecories = {
  input: './',
  output: './dist',
  template: './templates',
  blogs: './blogs',
}

export const defaultFiles = {
  main: 'main.md',
  blog_example_1: './blog/first-post.md',
  blog_example_2: './blog/second-post.md',
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
  return fs.readdirSync(source, { withFileTypes: true })
}

export const writeFile = (source: string, content?: string) => {
  fs.writeFileSync(source, content ?? '')
}

export const readFile = (source: string) => {
  try {
    return fs.readFileSync(source, 'utf-8')
  } catch (error) {
    return null
  }
}

export const createTagsDirectory = (source: string, tags: string[]) => {
  tags.forEach((tag) => {
    const tagDirectory = `${source}/${tag}`
    buildDirectory(tagDirectory)
  })
}
