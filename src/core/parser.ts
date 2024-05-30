import frontMatter from 'gray-matter/'
import mdToHtml from 'markdown-it'
import { TConfigFile, TFrontMatter, configSchema } from '../types/index.js'
import { readFile } from '../utils/directory.js'

export const parseFrontMatter = (content: string) => {
  const parsedData = frontMatter(content)
  return {
    content: parsedData.content,
    data: parsedData.data as TFrontMatter,
  }
}

export const toHtml = (content: string) => {
  const htmlContent = mdToHtml().render(content)
  return htmlContent
}

export const loadAndParseConfigFile = () => {
  try {
    const data = JSON.parse(readFile('test/config.json') ?? '')
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
