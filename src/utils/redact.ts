export default function redact<T extends Record<string, any>>(data: T, fields: (keyof T)[]): T {
  const clone: any = { ...data };
  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(clone, field)) {
      clone[field] = undefined;
    }
  });
  return clone as T;
}
