import { createPointerListeners } from '@solid-primitives/pointer';
import { Accessor } from 'solid-js';
import { Vec2 } from 'src/math';

type DragEventHandler = (value: Vec2) => void;

/**
 * Drag Handler Target and Event handler options
 */
interface MakeDragHandlerOptions {
  /**
   * Reference to element to bind event listeners to
   */
  target?: Accessor<EventTarget | undefined>;
  /**
   * Fired on pointer down
   */
  onDragStart?: DragEventHandler;
  /**
   * Fired on pointer move
   */
  onDragMove?: DragEventHandler;

  /**
   * Fired on pointer up
   */
  onDragEnd?: DragEventHandler;
}

/**
 * Set up drag handler callbacks that get cleaned up when drag event finishes
 *
 * @param opts - target and event handler options
 */
export function makeDragHandler(opts: MakeDragHandlerOptions): void {
  const dragStart: Vec2 = { x: -Infinity, y: -Infinity };
  const delta: Vec2 = { x: 0, y: 0 };
  let activeDrag: number | undefined = undefined;

  const onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId === activeDrag) {
      delta.x = e.clientX - dragStart.x;
      delta.y = e.clientY - dragStart.y;
      opts.onDragMove?.(delta);
    }
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId === activeDrag) {
      activeDrag = undefined;
      opts.onDragEnd?.(delta);
      delta.x = 0;
      delta.y = 0;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }
  };

  const onPointerDown = (e: PointerEvent): void => {
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    activeDrag = e.pointerId;
    opts.onDragStart?.(dragStart);
    window.addEventListener('pointermove', onPointerMove, {
      passive: false,
    });
    window.addEventListener('pointerup', onPointerUp, {
      passive: false,
    });
  };

  createPointerListeners({
    target: opts.target,
    onDown: onPointerDown,
  });
}
