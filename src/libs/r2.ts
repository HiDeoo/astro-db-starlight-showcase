import crypto from 'node:crypto'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { SHOWCASE_ENTRY_IMAGE_TYPES } from './schema'

let s3Client: S3Client

export async function uploadImage(image: File) {
  const fileName = getImageRandomName(image)

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: import.meta.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(await image.arrayBuffer()),
    }),
  )

  return fileName
}

export function deleteImage(fileName: string) {
  return getS3Client().send(
    new DeleteObjectCommand({
      Bucket: import.meta.env.R2_BUCKET_NAME,
      Key: fileName,
    }),
  )
}

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
      },
    })
  }

  return s3Client
}

function getImageRandomName(image: File) {
  return `${crypto.randomUUID()}.${getImageExtension(image)}`
}

function getImageExtension(image: File) {
  const type = SHOWCASE_ENTRY_IMAGE_TYPES.find((type) => type === image.type)

  if (!type) {
    throw new Error(`Invalid image type: ${image.type}`)
  }

  return type.split('/')[1]
}
