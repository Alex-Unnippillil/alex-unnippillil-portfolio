export default async function fetchPersonalized(): Promise<any> {
  const resp = await fetch('/api/personalized');
  return resp.json();
}
