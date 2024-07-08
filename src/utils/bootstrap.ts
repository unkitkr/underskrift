import { blogCongifOps } from '../core/parser.js'
import {
  buildDirectory,
  defaultDirectories,
  defaultFiles,
  joinPath,
  readDirectory,
  writeFile,
} from './directory.js'
import {
  blogPageSeeder,
  configSeeder,
  mainPageSeeder,
  tagsSeeder,
} from './seeder.js'

const directories = [defaultDirectories.blogs]
const files = [
  defaultFiles.config,
  defaultFiles.main,
  defaultFiles.blog_example_1,
  defaultFiles.blog_example_2,
  defaultFiles.tagSeedFile,
]

const checkIfConfigExists = async (folder?: string) => {
  const exists =
    readDirectory(folder ?? process.cwd()).filter(
      (f) => f === defaultFiles.config
    ).length > 0
  return exists
}

export const bootstrap = async (
  folder?: string,
  forceInitialize: boolean = false
) => {
  const configExists = await checkIfConfigExists(folder)
  if (configExists && !forceInitialize) {
    console.error('Blog already initialized in this directory')
    return
  }
  await Promise.all(directories.map((directory) => buildDirectory(directory)))
  await Promise.all(
    files.map((file, num) => {
      switch (file) {
        case defaultFiles.main:
          writeFile(joinPath([folder, defaultFiles.main]), mainPageSeeder)
          break
        case defaultFiles.config:
          writeFile(
            joinPath([folder, defaultFiles.config]),
            JSON.stringify(configSeeder, null, 2)
          )
          break
        case defaultFiles.tagSeedFile:
          writeFile(joinPath([folder, defaultFiles.tagSeedFile]), tagsSeeder)
          break
        default:
          const blogSeed = blogPageSeeder({
            title: `Your Title ${num + 1}`,
            date: new Date().toLocaleDateString('en-GB', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
            }),
          })
          writeFile(joinPath([folder, file]), blogSeed.textContent)
          blogCongifOps.writeBlogToConfig({
            title: blogSeed.content.title,
            date: blogSeed.content.date,
            slug: blogSeed.content.slug,
            tags: blogSeed.content.tags,
            description: blogSeed.content.description,
          })
          break
      }
    })
  )
}
