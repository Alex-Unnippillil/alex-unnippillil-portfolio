import { inspect } from '@xstate/inspect';
import { interpret, State } from 'xstate';
import wizardMachine from '@src/modules/wizard/wizardMachine';

inspect({ iframe: true });

const service = interpret(wizardMachine, { devTools: true });

const persisted = localStorage.getItem('wizard-state');
if (persisted) {
  try {
    const resolved = wizardMachine.resolveState(State.create(JSON.parse(persisted)));
    service.start(resolved);
  } catch {
    service.start();
  }
} else {
  service.start();
}

(window as any).wizardService = service;
