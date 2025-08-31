import { createTwoFilesPatch, diffLines } from 'diff';

export interface ChangeAnnotation {
  author: string;
  time: Date;
  reason: string;
}

export interface SplitDiffLine {
  left: string;
  right: string;
}

export interface DiffResult {
  unified: string;
  split: SplitDiffLine[];
}

interface HistoryEntry {
  oldContent: string;
  newContent: string;
  annotation: ChangeAnnotation;
}

export default class DiffManager {
  private history: HistoryEntry[] = [];

  generateDiff(
    fileName: string,
    oldContent: string,
    newContent: string,
    annotation: ChangeAnnotation,
  ): DiffResult {
    const result = this.createDiff(fileName, oldContent, newContent);
    this.history.push({ oldContent, newContent, annotation });
    return result;
  }

  previewRevert(index: number): DiffResult {
    const entry = this.history[index];
    if (!entry) {
      throw new Error('Change index out of range');
    }

    return this.createDiff('revert', entry.newContent, entry.oldContent);
  }

  getHistory(): HistoryEntry[] {
    return this.history;
  }

  private createDiff(fileName: string, oldContent: string, newContent: string): DiffResult {
    const unified = createTwoFilesPatch(
      `${fileName}-old`,
      `${fileName}-new`,
      oldContent,
      newContent,
    );

    const parts = diffLines(oldContent, newContent);
    const split: SplitDiffLine[] = [];

    parts.forEach((part) => {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      lines.forEach((line) => {
        if (part.added) {
          split.push({ left: '', right: line });
        } else if (part.removed) {
          split.push({ left: line, right: '' });
        } else {
          split.push({ left: line, right: line });
        }
      });
    });

    return { unified, split };
  }
}
