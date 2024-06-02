import frontMatter from 'gray-matter/'
import mdToHtml from 'markdown-it'
import {
  TBlog,
  TConfigFile,
  TFrontMatter,
  configSchema,
} from '../types/index.js'
import {
  defaultDirectories,
  defaultFiles,
  readFile,
  writeFile,
} from '../utils/directory.js'
import { blogPageSeeder } from '../utils/index.js'

export const parseFrontMatter = (content: string) => {
  const parsedData = frontMatter(content)
  return {
    content: toHtml(parsedData.content),
    data: parsedData.data as TFrontMatter,
  }
}

export const toHtml = (content: string) => {
  const htmlContent = mdToHtml().render(content)
  return htmlContent
}

export const loadAndParseConfigFile = () => {
  try {
    const data = JSON.parse(readFile(defaultFiles.config) ?? '')
    return data
      ? configSchema.parse(data)
        ? (data as TConfigFile)
        : null
      : null
  } catch (error) {
    console.error('Error reading config file')
    return null
  }
}

export const blogCongifOps = {
  writeBlogToCongig: (blog: TBlog) => {
    const configFile = loadAndParseConfigFile()
    if (!configFile) {
      console.error('Error reading config file')
      return
    }
    const updatedConfig = {
      ...configFile,
      blogs: [...configFile.blogs, blog],
    }
    writeFile(defaultFiles.config, JSON.stringify(updatedConfig, null, 2))
  },
  deleteBlogFromConfig: (blog: TBlog) => {
    const configFile = loadAndParseConfigFile()
    if (!configFile) {
      console.error('Error reading config file')
      return
    }
    const updatedConfig = {
      ...configFile,
      blogs: configFile.blogs.filter((b) => b.slug !== blog.slug),
    }
    writeFile(defaultFiles.config, JSON.stringify(updatedConfig, null, 2))
  },
  getBlogsByTags: () => {
    const configFile = loadAndParseConfigFile()
    if (!configFile) {
      console.error('Error reading config file')
      return
    }
    return configFile.blogs.reduce((acc, blog) => {
      blog.tags?.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = []
        }
        acc[tag].push(blog)
      })
      return acc
    }, {} as Record<string, TBlog[]>)
  },
}

export const generateNewPost = async (postName: string) => {
  const post = `${defaultDirectories.blogs}/${postName}`
  writeFile(
    post,
    blogPageSeeder({ title: postName, date: new Date().toISOString() })
  )
}
