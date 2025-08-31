export default function generateRequestId(): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${Date.now().toString(36)}-${random}`;
}
