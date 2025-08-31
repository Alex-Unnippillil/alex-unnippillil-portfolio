export interface Operation {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: any;
}

function buildPath(base: string, key: string | number): string {
  const segment = encodeURIComponent(String(key));
  return `${base}/${segment}`.replace(/\/+/g, '/');
}

export function generatePatch(oldObj: any, newObj: any, base = ''): Operation[] {
  const patch: Operation[] = [];

  // removals and replacements
  Object.keys(oldObj).forEach((key) => {
    const oldVal = oldObj[key];
    if (!(key in newObj)) {
      patch.push({ op: 'remove', path: buildPath(base, key) });
    } else {
      const newVal = newObj[key];
      if (typeof oldVal === 'object' && oldVal !== null && typeof newVal === 'object' && newVal !== null) {
        patch.push(...generatePatch(oldVal, newVal, buildPath(base, key)));
      } else if (oldVal !== newVal) {
        patch.push({ op: 'replace', path: buildPath(base, key), value: newVal });
      }
    }
  });

  // additions
  Object.keys(newObj).forEach((key) => {
    if (!(key in oldObj)) {
      patch.push({ op: 'add', path: buildPath(base, key), value: newObj[key] });
    }
  });

  return patch;
}

function getParent(target: any, path: string): { parent: any; key: string } {
  const segments = path.replace(/^\//, '').split('/').map((s) => decodeURIComponent(s));
  const key = segments.pop() as string;
  let parent = target;
  for (const seg of segments) {
    if (!(seg in parent)) {
      throw new Error(`Conflict at /${segments.join('/')}`);
    }
    parent = parent[seg];
  }
  return { parent, key };
}

export function applyPatch(target: any, operations: Operation[]): any {
  const clone = JSON.parse(JSON.stringify(target));

  operations.forEach((op) => {
    const { parent, key } = getParent(clone, op.path);

    switch (op.op) {
      case 'add':
        parent[key] = op.value;
        break;
      case 'replace':
        if (!(key in parent)) {
          throw new Error(`Conflict at ${op.path}`);
        }
        parent[key] = op.value;
        break;
      case 'remove':
        if (!(key in parent)) {
          throw new Error(`Conflict at ${op.path}`);
        }
        delete parent[key];
        break;
      default:
        throw new Error(`Unsupported operation: ${op.op}`);
    }
  });

  return clone;
}
