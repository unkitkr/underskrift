import {
  blogCongifOps,
  loadAndParseConfigFile,
  parseFrontMatter,
} from './parser.js'
import {
  buildDirectory,
  copyDirectory,
  defaultDirectories,
  defaultFiles,
  getFilesForBuild,
  joinPath,
  readFile,
} from '../utils/directory.js'
import njk from 'nunjucks'
import { TConfigFile } from '../types/core.js'
import { writeFile } from '../utils/directory.js'
import prettify from 'html-prettify'

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
  config: TConfigFile & { [key: string]: any }
) => {
  const { content, data } = parseFrontMatter(pageContent)
  const template = njk.compile(
    templateString,
    configureNunjucks() ?? njk.configure({ autoescape: true })
  )
  return {
    templateData: prettify(
      template.render({
        data: { content, metaData: data, config },
      })
    ),
    data,
  }
}

export const buildTagMainPage = (config: TConfigFile) => {
  const tagsIndexPage = readFile(
    joinPath([config.templateDir, defaultFiles.tagFrontTemplate])
  )
  if (!tagsIndexPage) {
    console.error('Error reading tag index template')
    return
  }
  const tagLoadedPage = getFilesForBuild.tags(config)
  const allTags = blogCongifOps.getAllTags()

  return tagLoadedPage
    ? buildPage(tagLoadedPage, tagsIndexPage ?? '', {
        ...config,
        tags: allTags,
      })
    : null
}

export const buildTagsPages = (config: TConfigFile) => {
  const blogByTags = blogCongifOps.getBlogsByTags()
  const tagsTemplate =
    readFile(joinPath([config.templateDir, defaultFiles.tagTemplate])) ?? ''
  return Object.keys(blogByTags ?? []).map((tag) => {
    const blogs = blogByTags?.[tag]
    const tagsPage = njk.compile(
      tagsTemplate,
      configureNunjucks() ?? njk.configure({ autoescape: true })
    )
    return {
      templateData: tagsPage.render({ data: { tag, blogs, config } }),
      tag,
    }
  })
}

export const copyStaticFiles = (config: TConfigFile) => {
  const staticDir = joinPath([config.templateDir, defaultDirectories.static])
  const outputDir = joinPath([config.outputDir, defaultDirectories.static])
  copyDirectory(staticDir, outputDir)
    ? console.log('Static files copied')
    : console.error('Error copying static files')
}

export const buildMainPage = (config: TConfigFile) => {
  const loadedPage = getFilesForBuild.mainPage(config)
  const configWithLatestBlogs = {
    ...config,
    blogs: blogCongifOps.getLatestBlogs(2) ?? [],
  }
  const mainTemplate =
    readFile(joinPath([config.templateDir, defaultFiles.indexTemplate])) ?? ''
  return loadedPage
    ? buildPage(loadedPage, mainTemplate, configWithLatestBlogs)
    : null
}

export const buildBlogPages = (config: TConfigFile) => {
  const blogIndexTemplate = readFile(
    joinPath([config.templateDir, defaultFiles.blogFrontTemplate])
  )
  if (!blogIndexTemplate) {
    console.error('Error reading blog index template')
  }
  writeFile(
    joinPath([
      config.outputDir,
      defaultDirectories.blogs,
      defaultFiles.indexTemplate,
    ]),
    buildPage('', blogIndexTemplate ?? '', config).templateData
  )
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
  copyStaticFiles(config)

  const blogPages = buildBlogPages(config)
    .map((page) => page)
    .filter((page) => !!page?.templateData)

  const mainPage = buildMainPage(config)?.templateData
  const tagsMainPage = buildTagMainPage(config)?.templateData
  writeFile(
    joinPath([
      outputDir,
      defaultDirectories.outputTags,
      defaultFiles.indexTemplate,
    ]),
    tagsMainPage
  )

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
