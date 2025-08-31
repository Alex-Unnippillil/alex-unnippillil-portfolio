import React from 'react';
import { restoreSnapshot } from '../utils/snapshotStore';

interface Props {
  id: string;
  onRestore?: (data: unknown) => void;
}

const RevertSnapshotButton: React.FC<Props> = ({ id, onRestore }) => {
  const handleClick = (): void => {
    const data = restoreSnapshot(id);
    if (onRestore && data !== undefined) {
      onRestore(data);
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      Revert
    </button>
  );
};

export default RevertSnapshotButton;
