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
          writeFile(
            joinPath([folder, file]),
            blogPageSeeder({
              title: `Your Title ${num + 1}`,
              date: new Date().toISOString(),
            })
          )
          blogCongifOps.writeBlogToCongig({
            title: `Your Title ${num + 1}`,
            date: new Date().toISOString(),
          })
          break
      }
    })
  )
}
