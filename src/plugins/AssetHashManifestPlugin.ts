import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { Compiler } from 'webpack';

export default class AssetHashManifestPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.afterEmit.tap('AssetHashManifestPlugin', (compilation) => {
      const manifest: Record<string, string> = {};
      compilation.getAssets().forEach((asset) => {
        const source = asset.source.source();
        const hash = createHash('sha256').update(source).digest('hex');
        manifest[asset.name] = hash;
      });
      const outputPath = compiler.options.output?.path || '';
      const manifestPath = path.join(outputPath, 'asset-manifest.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    });
  }
}
