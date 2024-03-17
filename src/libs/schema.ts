import { z } from 'astro/zod'
import { zfd } from 'zod-form-data'

export const addShowcaseEntrySchema = zfd.formData({
  url: zfd.text(z.string().url()),
  name: zfd.text(z.string()),
})

export const deleteShowcaseEntrySchema = zfd.formData({
  action: zfd.text(z.literal('delete')),
  id: zfd.text(z.string().uuid()),
})

export const changeApprovalShowcaseEntrySchema = zfd.formData({
  action: zfd.text(z.union([z.literal('approve'), z.literal('reject')])),
  id: zfd.text(z.string().uuid()),
})
