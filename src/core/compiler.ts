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

const getConfig = () => {
  return loadAndParseConfigFile() ?? null
}

export const buildPage = (pageContent: string, templateString: string) => {
  const { content, data } = parseFrontMatter(pageContent)
  const template = Handlebars.compile(templateString)
  return template({ ...data, content })
}

export const buildMainPage = (config: TConfigFile) => {
  const loadedPage = getFilesForBuild.mainPage(config)
  return loadedPage
    ? buildPage(
        loadedPage,
        joinPath([config.templateDir, defaultFiles.outputIndex])
      )
    : null
}

export const buildBlogPages = (config: TConfigFile) => {
  const blogs = getFilesForBuild.blogs(config)
  return blogs.map((blog) => {
    const loadedBlog = blog ? readFile(blog) : null
    return loadedBlog
      ? buildPage(
          loadedBlog,
          joinPath([config.templateDir, defaultFiles.outputBlog])
        )
      : null
  })
}

export const buildPages = () => {
  const config = getConfig()
  if (!config) {
    console.error('Error reading config file')
    return
  }
  const { inputDir, outputDir, templateDir } = config

  buildDirectory(outputDir ?? defaultDirectories.output)
}
