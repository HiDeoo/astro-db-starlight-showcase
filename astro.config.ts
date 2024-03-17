import { defineConfig } from 'astro/config'
import db from '@astrojs/db'
import starlight from '@astrojs/starlight'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    db(),
    starlight({
      title: 'My Docs',
      social: {
        github: 'https://github.com/withastro/starlight',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Example Guide',
              link: '/guides/example/',
            },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
        {
          label: 'Showcase',
          link: '/showcase/',
        },
      ],
    }),
  ],
  output: 'hybrid',
})
