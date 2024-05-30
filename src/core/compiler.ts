import { loadAndParseConfigFile, parseFrontMatter } from './parser.js'
import {
  buildDirectory,
  defaultDirectories,
  defaultFiles,
  getFilesForBuild,
  joinPath,
  readFile,
} from '../utils/directory.js'
import Handlebars from 'handlebars'
import { TConfigFile } from '../types/core.js'
import { writeFile } from '../utils/directory.js'

const getConfig = () => {
  return loadAndParseConfigFile() ?? null
}

export const buildPage = (
  pageContent: string,
  templateString: string,
  config: TConfigFile
) => {
  const { content, data } = parseFrontMatter(pageContent)
  const template = Handlebars.compile(templateString)
  return template({ ...data, content, metaData: data, config })
}

export const buildMainPage = (config: TConfigFile) => {
  const loadedPage = getFilesForBuild.mainPage(config)
  const mainTemplate =
    readFile(joinPath([config.templateDir, defaultFiles.indexTemplate])) ?? ''
  return loadedPage ? buildPage(loadedPage, mainTemplate, config) : null
}

export const buildBlogPages = (config: TConfigFile) => {
  const blogs = getFilesForBuild.blogs(config)
  const blogTemplate =
    readFile(joinPath([config.templateDir, defaultFiles.blogTemplate])) ?? ''
  return blogs.map((blog) => {
    const loadedBlog = blog ?? null
    return loadedBlog ? buildPage(loadedBlog, blogTemplate, config) : null
  })
}

export const buildPages = () => {
  const config = getConfig()
  if (!config) {
    console.error('Error reading config file')
    return
  }
  const { outputDir } = config
  const blogsOutputDir = joinPath([outputDir, defaultDirectories.outputBlogs])
  buildDirectory(outputDir ?? defaultDirectories.output)
  buildDirectory(blogsOutputDir)

  const blogPages = buildBlogPages(config)
    .map((page) => page)
    .filter((page): page is string => !!page)
  const mainPage = buildMainPage(config)

  writeFile(joinPath([outputDir, defaultFiles.indexTemplate]), mainPage ?? '')
  blogPages.forEach((page, index) => {
    writeFile(joinPath([blogsOutputDir, `blog-${index + 1}.html`]), page)
  })
}

buildPages()
