import { createPointerListeners } from '@solid-primitives/pointer';
import { DB_CLICK_THRESHOLD } from 'src/defaults/constants';

/**
 * Bind an event listener to a double tap/click action
 * @param target - DOM node to attach listeners to
 * @param onDoubleClick - PointerEvent handler to run on double click event
 */
export function makeDoubleTapListener(
  target: Parameters<typeof createPointerListeners>[0]['target'],
  onDoubleClick: (e: PointerEvent) => void,
): void {
  let lastTap = -Infinity;
  createPointerListeners({
    target,
    onUp: (e) => {
      const now = performance.now();
      if (now - lastTap < DB_CLICK_THRESHOLD) {
        onDoubleClick(e);
        lastTap = -Infinity;
      } else {
        lastTap = now;
      }
    },
  });
}
