import React, { useEffect, useState } from 'react';
import {
  getSnapshots,
  subscribe,
  Snapshot,
} from '../utils/snapshotStore';
import RevertSnapshotButton from './RevertSnapshotButton';

interface Props {
  onRestore?: (data: unknown) => void;
}

const FormSaveTimeline: React.FC<Props> = ({ onRestore }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(getSnapshots());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSnapshots(getSnapshots());
    });
    return unsubscribe;
  }, []);

  return (
    <ul>
      {snapshots.map((snapshot) => (
        <li key={snapshot.id}>
          <span>{new Date(snapshot.createdAt).toLocaleString()}</span>
          <RevertSnapshotButton id={snapshot.id} onRestore={onRestore} />
        </li>
      ))}
    </ul>
  );
};

export default FormSaveTimeline;
