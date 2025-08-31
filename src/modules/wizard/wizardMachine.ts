import { createMachine, assign } from 'xstate';

export interface WizardContext {
  detail: string;
}

export type WizardEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SUBMIT' }
  | { type: 'UPDATE'; value: string };

const wizardMachine = createMachine<WizardContext, WizardEvent>({
  id: 'wizard',
  context: { detail: '' },
  initial: 'start',
  states: {
    start: {
      on: { NEXT: 'details' },
    },
    details: {
      on: {
        UPDATE: { actions: 'setDetail' },
        NEXT: { target: 'summary', cond: 'isDetailValid' },
        PREV: 'start',
      },
    },
    summary: {
      on: {
        PREV: 'details',
        SUBMIT: 'done',
      },
    },
    done: {
      type: 'final',
    },
  },
}, {
  actions: {
    setDetail: assign({
      detail: (_ctx, event) =>
        event.type === 'UPDATE' ? event.value : _ctx.detail,
    }),
  },
  guards: {
    isDetailValid: (ctx) => ctx.detail.trim().length > 0,
  },
});

export default wizardMachine;
