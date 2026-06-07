import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function extractKeyFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1);
  } catch (error) {
    return null;
  }
}

export async function deleteImagesFromS3(urls: string[]) {
  if (!urls || urls.length === 0) return;

  const keys = urls
    .map(extractKeyFromUrl)
    .filter((key) => key !== null)
    .map((Key) => ({ Key: Key as string }));

  if (keys.length === 0) return;

  const command = new DeleteObjectsCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Delete: {
      Objects: keys,
    },
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Failed to delete images from S3:', error);
  }
}
