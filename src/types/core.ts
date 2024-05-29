import { z } from 'zod'

export type TFrontMatter = {
  title: string
  date: string
  tags?: string[]
  description?: string
  author?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  slug?: string
}

export type TBlogSeeder = TFrontMatter

export const NavItemSchema = z.object({
  title: z.string(),
  url: z.string(),
})
export type NavItem = z.infer<typeof NavItemSchema>

export const SocialSchema = z.object({
  name: z.string(),
  url: z.string(),
})
export type Social = z.infer<typeof SocialSchema>

export const configSchema = z.object({
  inputDir: z.string(),
  outputDir: z.string(),
  templateDir: z.string(),
  navItems: z.array(NavItemSchema),
  siteTitle: z.string(),
  socials: z.array(SocialSchema),
})
export type TConfigFile = z.infer<typeof configSchema>
