export interface FlagDefaults {
  preview: boolean;
  production: boolean;
  dangerous?: boolean;
}

const flags: Record<string, FlagDefaults> = {
  sample: { preview: true, production: false, dangerous: true },
};

export default flags;
