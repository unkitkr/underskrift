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
  defaultFiles.main,
  defaultFiles.blog_example_1,
  defaultFiles.blog_example_2,
  defaultFiles.config,
]

export const bootstrap = async (folder?: string) => {
  await Promise.all(
    directories.map((directory) => buildDirectory('test/' + directory))
  )
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
          break
      }
    })
  )
}

export const generateNewPost = async (postName: string) => {
  const post = `${defaultDirectories.blogs}/${postName}`
  writeFile(
    post,
    blogPageSeeder({ title: postName, date: new Date().toISOString() })
  )
}

bootstrap('test/')
