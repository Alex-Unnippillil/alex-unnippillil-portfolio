import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const checklistFile = path.join(rootDir, 'RELEASE_CHECKLIST.md');
const archiveDir = path.join(rootDir, 'release-checklists');
const changelogFile = path.join(rootDir, 'CHANGELOG.md');

interface Item {
  task: string;
  owner: string;
  date: string;
}

function generate(version: string, items: Item[]): void {
  fs.mkdirSync(archiveDir, { recursive: true });
  const lines: string[] = [];
  lines.push(`# Release ${version} Checklist`);
  lines.push('');
  items.forEach((item) => {
    lines.push(`- [ ] ${item.task} (Owner: ${item.owner}, Due: ${item.date})`);
  });
  lines.push('');
  fs.writeFileSync(checklistFile, lines.join('\n'));
}

function verify(): void {
  if (!fs.existsSync(checklistFile)) {
    return;
  }
  const content = fs.readFileSync(checklistFile, 'utf8');
  if (content.match(/- \[ \]/)) {
    console.error('Release checklist has open items.');
    process.exit(1);
  }
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

function archive(version: string): void {
  if (!fs.existsSync(checklistFile)) {
    console.error('Checklist file not found.');
    process.exit(1);
  }
  fs.mkdirSync(archiveDir, { recursive: true });
  const target = path.join(archiveDir, `release-${version}.md`);
  fs.renameSync(checklistFile, target);

  if (fs.existsSync(changelogFile)) {
    const changelog = fs.readFileSync(changelogFile, 'utf8');
    const regex = new RegExp(`(^## \[?${escapeRegExp(version)}\]?[^\n]*$)`, 'm'); // eslint-disable-line no-useless-escape
    if (regex.test(changelog)) {
      const updated = changelog.replace(regex, `$1 [Checklist](release-checklists/release-${version}.md)`);
      fs.writeFileSync(changelogFile, updated);
    }
  }
}

function parseItems(rawItems: string[]): Item[] {
  return rawItems.map((raw) => {
    const [task, owner, date] = raw.split('|');
    return { task, owner, date } as Item;
  });
}

const [command, version, ...rest] = process.argv.slice(2);

switch (command) {
  case 'generate':
    if (!version || rest.length === 0) {
      console.error('Usage: release-checklist generate <version> "task|owner|date" ...');
      process.exit(1);
    }
    generate(version, parseItems(rest));
    break;
  case 'verify':
    verify();
    break;
  case 'archive':
    if (!version) {
      console.error('Usage: release-checklist archive <version>');
      process.exit(1);
    }
    archive(version);
    break;
  default:
    console.error('Usage: release-checklist <generate|verify|archive>');
    process.exit(1);
}
