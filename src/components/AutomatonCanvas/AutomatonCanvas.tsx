import { useEffect, type RefObject, type MutableRefObject } from 'react'
import { useDraggableContainer } from '@/hooks/useDraggableContainer'

export const canvasConfig = {
  rowsCount: 200,
  colsCount: 300,
  cellSize: 6,
  gap: 2,
  paddingOffset: 2,
  width: () => {
    return (
      canvasConfig.colsCount * (canvasConfig.cellSize + canvasConfig.gap) +
      canvasConfig.paddingOffset * 2 -
      canvasConfig.gap
    )
  },
  height: () => {
    return (
      canvasConfig.rowsCount * (canvasConfig.cellSize + canvasConfig.gap) +
      canvasConfig.paddingOffset * 2 -
      canvasConfig.gap
    )
  },
}

export interface AutomatonCanvasProps<GridType> {
  canvasRef: RefObject<HTMLCanvasElement>
  gridRef: MutableRefObject<GridType>
  createGrid: (state: 'empty' | 'random') => GridType
  updateGrid: (prevGrid: GridType) => GridType
  drawGrid: (ctx: CanvasRenderingContext2D, grid: GridType) => void
  isRunning: boolean
}

export const AutomatonCanvas = <GridType,>(
  props: AutomatonCanvasProps<GridType>,
): JSX.Element => {
  const { canvasRef, gridRef, createGrid, updateGrid, drawGrid, isRunning } =
    props

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    gridRef.current = createGrid('random')
    drawGrid(ctx, gridRef.current)
    // should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    let animationFrameId: number

    const render = (): void => {
      if (!isRunning) return

      gridRef.current = updateGrid(gridRef.current)
      drawGrid(ctx, gridRef.current)
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  const draggableContainerRef = useDraggableContainer<HTMLDivElement>(true, {
    w: canvasConfig.width(),
    h: canvasConfig.height(),
  })

  return (
    <div
      ref={draggableContainerRef}
      className="h-full w-full cursor-grab overflow-auto rounded border border-white p-1"
    >
      <canvas
        width={canvasConfig.width()}
        height={canvasConfig.height()}
        ref={canvasRef}
        className="h-fit w-fit"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
