import IEvent from './IEvent';

export default interface IDashboard {
  send(event: IEvent): void;
}
