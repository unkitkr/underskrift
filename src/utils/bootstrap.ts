import {
  buildDirectory,
  defaultDirecories,
  defaultFiles,
  writeFile,
} from './directory.js'
import { blogPageSeeder, mainPageSeeder } from './seeder.js'

const directories = [defaultDirecories.blogs]
const files = [
  defaultFiles.main,
  defaultFiles.blog_example_1,
  defaultFiles.blog_example_2,
]

export const bootstrap = async () => {
  await Promise.all(directories.map((directory) => buildDirectory(directory)))
  await Promise.all(
    files.map((file, num) =>
      writeFile(
        file,
        file === 'main.md'
          ? mainPageSeeder
          : blogPageSeeder({
              title: `Your Title ${num + 1}`,
              date: new Date().toISOString(),
            })
      )
    )
  )
}

export const generateNewPost = async (postName: string) => {
  const post = `./blog/${postName}`
  writeFile(
    post,
    blogPageSeeder({ title: postName, date: new Date().toISOString() })
  )
}

bootstrap()
