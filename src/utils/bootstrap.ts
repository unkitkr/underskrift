import { blogCongifOps } from '../core/parser.js'
import {
  buildDirectory,
  defaultDirectories,
  defaultFiles,
  joinPath,
  writeFile,
} from './directory.js'
import { blogPageSeeder, configSeeder, mainPageSeeder } from './seeder.js'

const directories = [defaultDirectories.blogs]
const files = [
  defaultFiles.config,
  defaultFiles.main,
  defaultFiles.blog_example_1,
  defaultFiles.blog_example_2,
]

export const bootstrap = async (folder?: string) => {
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
        default:
          const blogSeed = blogPageSeeder({
            title: `Your Title ${num + 1}`,
            date: new Date().toISOString(),
          })
          writeFile(joinPath([folder, file]), blogSeed.textContent)
          blogCongifOps.writeBlogToConfig({
            title: blogSeed.content.title,
            date: blogSeed.content.date,
            slug: blogSeed.content.slug,
            tags: blogSeed.content.tags,
          })
          break
      }
    })
  )
}
