import { loadAndParseConfigFile } from './parser.js'
import { buildDirectory, defaultDirecories } from '../utils/directory.js'

const getConfig = () => {
  return loadAndParseConfigFile() ?? null
}

export const buildPages = () => {
  const config = getConfig()
  if (!config) {
    console.error('Error reading config file')
    return
  }
  const { inputDir, outputDir, templateDir } = config

  buildDirectory(outputDir ?? defaultDirecories.output)
}
