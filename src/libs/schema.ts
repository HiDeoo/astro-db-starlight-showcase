import { z } from 'astro/zod'
import { zfd } from 'zod-form-data'

export const newShowcaseEntrySchema = zfd.formData({
  url: zfd.text(z.string().url()),
  name: zfd.text(),
})
