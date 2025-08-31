import fs from 'fs';
import path from 'path';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from '../src/schema';

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'GPortfolio API',
    version: '1.0.0',
  },
});

const outputPath = path.resolve(process.cwd(), 'public/export/openapi.json');
const output = JSON.stringify(doc, null, 2);

if (process.argv.includes('--check')) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== output) {
    console.error('OpenAPI schema is out of date. Run `yarn generate-openapi` to update.');
    process.exit(1);
  }
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output);
}
