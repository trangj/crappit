export function parseTextFromHtml(html: string) {
  return html.replace(/<\/?[^>]+>/gi, ' ').trim();
}
