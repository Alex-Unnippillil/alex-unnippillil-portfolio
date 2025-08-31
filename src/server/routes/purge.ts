import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
router.use(express.json());

const manifestPath = path.resolve(__dirname, '../../../public/assets-manifest.json');
const logPath = path.resolve(__dirname, '../../../data/purge-log.json');

interface Manifest { [file: string]: string[]; }

router.post('/', (req, res) => {
  const groupsParam = req.body.groups || req.query.groups || req.body.group || req.query.group;
  const groups: string[] = Array.isArray(groupsParam)
    ? groupsParam
    : typeof groupsParam === 'string'
      ? groupsParam.split(',').map((g) => g.trim()).filter(Boolean)
      : [];

  if (groups.length === 0) {
    res.status(400).json({ error: 'No groups provided' });
    return;
  }

  let manifest: Manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as Manifest;
  } catch (err) {
    res.status(500).json({ error: 'Failed to read assets manifest' });
    return;
  }

  const assets = Object.entries(manifest)
    .filter(([_, assetGroups]) => assetGroups.some((g) => groups.includes(g)))
    .map(([file]) => file);

  const entry = { timestamp: new Date().toISOString(), groups, assets };
  try {
    let log: any[] = [];
    if (fs.existsSync(logPath)) {
      const data = fs.readFileSync(logPath, 'utf-8');
      log = JSON.parse(data);
      if (!Array.isArray(log)) log = [];
    }
    log.push(entry);
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  } catch (err) {
    res.status(500).json({ error: 'Failed to write purge log' });
    return;
  }

  res.json({ purged: assets });
});

export default router;
