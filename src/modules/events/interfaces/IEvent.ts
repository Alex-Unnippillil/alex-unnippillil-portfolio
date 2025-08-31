export default interface IEvent {
  event: string;
  version: string;
  owner: string;
  timestamp: string;
  properties?: { [key: string]: any };
}
