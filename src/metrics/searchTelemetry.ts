export default function logZeroResult(query: string): void {
  // In a real application, replace this with actual telemetry integration.
  console.warn(`Zero search results for query: "${query}"`);
}
