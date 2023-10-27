import { includesMultiple } from '@/utils/string.utils'
import { useEffect, useRef, type RefObject } from 'react'

const REQUIRED_CLASSES = ['cursor-grab', 'overflow-auto'] as const

export const useDraggableContainer = <T extends HTMLElement>(
  centerContent?: boolean,
  contentDimensions?: { w: number; h: number },
): RefObject<T> => {
  const draggableContainerRef = useRef<T>(null)

  useEffect(() => {
    if (!draggableContainerRef.current) return

    const container = draggableContainerRef.current

    if (!includesMultiple(container.className, REQUIRED_CLASSES))
      throw new Error(
        'Draggable container must include required classes: ' +
          REQUIRED_CLASSES.join(', '),
      )

    let pos = { top: 0, left: 0, x: 0, y: 0 }

    if (centerContent && contentDimensions) {
      container.scrollLeft = (contentDimensions.w - container.clientWidth) / 2
      container.scrollTop = (contentDimensions.h - container.clientHeight) / 2
    }

    container.addEventListener('mousedown', mouseDownHandler)

    function mouseDownHandler(e: MouseEvent): void {
      pos = {
        left: container.scrollLeft,
        top: container.scrollTop,
        x: e.clientX,
        y: e.clientY,
      }

      container.classList.remove('cursor-grab')
      container.classList.add('cursor-grabbing')

      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    }

    const mouseMoveHandler = (e: MouseEvent): void => {
      const dx = e.clientX - pos.x
      const dy = e.clientY - pos.y

      container.scrollTop = pos.top - dy
      container.scrollLeft = pos.left - dx
    }

    const mouseUpHandler = (): void => {
      container.classList.remove('cursor-grabbing')
      container.classList.add('cursor-grab')

      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }

    // should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return draggableContainerRef
}
