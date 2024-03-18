import { z } from 'astro/zod'
import { imageDimensionsFromData } from 'image-dimensions'
import { zfd } from 'zod-form-data'

export const SHOWCASE_ENTRY_IMAGE_TYPES = ['image/avif', 'image/jpeg', 'image/png', 'image/webp']
export const SHOWCASE_ENTRY_IMAGE_MAX_SIZE_IN_MB = 1
export const SHOWCASE_ENTRY_IMAGE_WIDTH = 800
export const SHOWCASE_ENTRY_IMAGE_HEIGHT = 450

export const addShowcaseEntrySchema = zfd.formData({
  url: zfd.text(z.string().url()),
  name: zfd.text(z.string()),
  image: zfd
    .file()
    .refine((file) => SHOWCASE_ENTRY_IMAGE_TYPES.includes(file.type), {
      message: `Image format must be one of: ${SHOWCASE_ENTRY_IMAGE_TYPES.map((format) => format.split('/')[1]).join(', ')}.`,
    })
    .refine((file) => file.size <= SHOWCASE_ENTRY_IMAGE_MAX_SIZE_IN_MB * 1024 * 1024, {
      message: `Image must be less than ${SHOWCASE_ENTRY_IMAGE_MAX_SIZE_IN_MB}MB.`,
    })
    .refine(
      async (file) => {
        const size = imageDimensionsFromData(Buffer.from(await file.arrayBuffer()))
        return size && size.width === SHOWCASE_ENTRY_IMAGE_WIDTH && size.height === SHOWCASE_ENTRY_IMAGE_HEIGHT
      },
      {
        message: `Image size must be exactly ${SHOWCASE_ENTRY_IMAGE_WIDTH}x${SHOWCASE_ENTRY_IMAGE_HEIGHT}.`,
      },
    ),
})

export const deleteShowcaseEntrySchema = zfd.formData({
  action: zfd.text(z.literal('delete')),
  id: zfd.text(),
})

export const changeApprovalShowcaseEntrySchema = zfd.formData({
  action: zfd.text(z.union([z.literal('approve'), z.literal('reject')])),
  id: zfd.text(),
})
