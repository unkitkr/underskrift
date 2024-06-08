import {
  blogCongifOps,
  loadAndParseConfigFile,
  parseFrontMatter,
} from './parser.js'
import {
  buildDirectory,
  defaultDirectories,
  defaultFiles,
  getFilesForBuild,
  joinPath,
  readFile,
} from '../utils/directory.js'
import njk from 'nunjucks'
import { TConfigFile } from '../types/core.js'
import { writeFile } from '../utils/directory.js'

const getConfig = () => {
  return loadAndParseConfigFile() ?? null
}

const configureNunjucks = () => {
  const templateDir = getConfig()?.templateDir
  if (!templateDir) {
    console.error('Error reading config file')
    return
  }
  return njk.configure(joinPath([process.cwd(), templateDir]), {
    autoescape: true,
  })
}

export const buildPage = (
  pageContent: string,
  templateString: string,
  config: TConfigFile
) => {
  const { content, data } = parseFrontMatter(pageContent)
  const template = njk.compile(
    templateString,
    configureNunjucks() ?? njk.configure({ autoescape: true })
  )
  return {
    templateData: template.render({ ...data, content, metaData: data, config }),
    data,
  }
}

export const buildTagsPages = (config: TConfigFile) => {
  const blogByTags = blogCongifOps.getBlogsByTags()
  const tagsTemplate =
    readFile(joinPath([config.templateDir, defaultFiles.tagsTemplate])) ?? ''
  return Object.keys(blogByTags ?? []).map((tag) => {
    const blogs = blogByTags?.[tag]
    const tagsPage = njk.compile(
      tagsTemplate,
      configureNunjucks() ?? njk.configure({ autoescape: true })
    )
    return { templateData: tagsPage.render({ tag, blogs, config }), tag }
  })
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
  const tagsOutputDir = joinPath([outputDir, defaultDirectories.outputTags])
  buildDirectory(outputDir ?? defaultDirectories.output)
  buildDirectory(blogsOutputDir)
  buildDirectory(tagsOutputDir)

  const blogPages = buildBlogPages(config)
    .map((page) => page)
    .filter((page) => !!page?.templateData)

  const mainPage = buildMainPage(config)?.templateData

  writeFile(joinPath([outputDir, defaultFiles.indexTemplate]), mainPage ?? '')
  blogPages.forEach((page) => {
    writeFile(
      joinPath([blogsOutputDir, `${page?.data.slug}.html`]),
      page?.templateData
    )
  })
  buildTagsPages(config).forEach((page) => {
    writeFile(
      joinPath([outputDir, defaultDirectories.outputTags, `${page.tag}.html`]),
      page.templateData
    )
  })
}
