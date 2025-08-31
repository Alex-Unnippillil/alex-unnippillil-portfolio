import { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express, { Application, Request, Response } from 'express';

export default class Server {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(app: Application, server: WebpackDevServer, compiler: Compiler): void {
    app.post('/api/upload', express.raw({ limit: '5mb', type: '*/*' }), (req: Request, res: Response) => {
      const buffer = req.body as Buffer;
      const mime = detectMime(buffer);
      if (!mime) {
        res.status(400).json({ error: 'Unsupported MIME type' });
        return;
      }
      const dims = getDimensions(buffer, mime);
      if (!dims) {
        res.status(400).json({ error: 'Cannot determine image dimensions' });
        return;
      }
      const MAX_W = 2000;
      const MAX_H = 2000;
      if (dims.width > MAX_W || dims.height > MAX_H) {
        res.status(400).json({
          error: `Image dimensions ${dims.width}x${dims.height} exceed ${MAX_W}x${MAX_H}`,
        });
        return;
      }
      res.json({ mime, width: dims.width, height: dims.height });
    });
  }
}

function detectMime(buffer: Buffer): string | null {
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp' && buffer.toString('ascii', 8, 12).startsWith('avif')) {
    return 'image/avif';
  }
  const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (jpeg) return 'image/jpeg';
  const png = buffer.toString('ascii', 1, 4) === 'PNG';
  if (png) return 'image/png';
  return null;
}

function getDimensions(buffer: Buffer, mime: string): { width: number; height: number } | null {
  try {
    if (mime === 'image/png') {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (mime === 'image/jpeg') {
      let offset = 2;
      while (offset < buffer.length) {
        const marker = buffer[offset + 1];
        const size = buffer.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + size;
      }
    }
    if (mime === 'image/webp') {
      const chunk = buffer.toString('ascii', 12, 16);
      if (chunk === 'VP8X') {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height };
      }
      if (chunk === 'VP8 ') {
        const start = 26;
        const width = buffer.readUInt16LE(start) & 0x3fff;
        const height = buffer.readUInt16LE(start + 2) & 0x3fff;
        return { width, height };
      }
      if (chunk === 'VP8L') {
        const start = 21;
        const bits = buffer.readUInt32LE(start);
        const width = (bits & 0x3fff) + 1;
        const height = ((bits >> 14) & 0x3fff) + 1;
        return { width, height };
      }
    }
    if (mime === 'image/avif') {
      let offset = 0;
      while (offset + 8 < buffer.length) {
        const size = buffer.readUInt32BE(offset);
        const type = buffer.toString('ascii', offset + 4, offset + 8);
        if (type === 'ispe') {
          return {
            width: buffer.readUInt32BE(offset + 8),
            height: buffer.readUInt32BE(offset + 12),
          };
        }
        if (size <= 0) break;
        offset += size;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}
