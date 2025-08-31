import type { NextApiRequest, NextApiResponse } from 'next';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Generates signed upload URLs for Vercel Blob storage.
 */
export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const body = (req.body ?? {}) as HandleUploadBody;
  const json = await handleUpload({
    request: req,
    body,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['image/*'],
    }),
  });

  res.status(200).json(json);
}
