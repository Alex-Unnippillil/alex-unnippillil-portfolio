export default async function share(summary: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: summary,
        url: window.location.href,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}
