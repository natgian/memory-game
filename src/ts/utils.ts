/**
 * Updates the span text of ab element.
 *
 * @param selector - CSS selector of the span element to update
 * @param text - Text to be updated in the span
 */
export function updateSpanText(selector: string, text: string | null): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element && text) {
    element.innerText = text;
  }
}
