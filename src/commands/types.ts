export interface Command {
  id: string;
  title: string;
  keywords: string[];
  run: () => void | Promise<void>;
}
