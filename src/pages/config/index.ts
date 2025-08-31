import DeleteManager from '../../utils/DeleteManager';

(() => {
  const button = document.getElementById('delete-account');
  const status = document.getElementById('delete-status');

  if (!button || !status) {
    return;
  }

  button.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('This will permanently remove your data. You have 5 seconds to undo. Continue?');
    if (!confirmed) {
      return;
    }

    status.textContent = 'Pending delete...';

    const progress = document.createElement('progress');
    progress.max = 5;
    progress.value = 0;
    status.appendChild(progress);

    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo';
    status.appendChild(undoBtn);

    const op = DeleteManager.schedule(() => {
      status.textContent = 'Deletion complete';
    }, {
      delayMs: 5000,
      intervalMs: 1000,
      onTick: (msLeft) => {
        progress.value = (5 - msLeft / 1000);
      },
    });

    undoBtn.addEventListener('click', () => {
      op.undo();
      status.textContent = 'Deletion cancelled';
    });

    op.promise.then(() => {
      progress.remove();
      undoBtn.remove();
    });
  });
})();
