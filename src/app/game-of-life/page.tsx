'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'
import { drawRoundedRects } from '@/utils/canvas.utils'
import { tailwindColors } from '~/tailwind.config'

const ROWS_COUNT = 200
const COLS_COUNT = 300
const CELL_SIZE = 6
const GAP = 2
const PADDING_OFFSET = 2
const CANVAS_WIDTH = COLS_COUNT * (CELL_SIZE + GAP) + PADDING_OFFSET * 2 - GAP
const CANVAS_HEIGHT = ROWS_COUNT * (CELL_SIZE + GAP) + PADDING_OFFSET * 2 - GAP

const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export default function GameOfLifeCanvas() {
  const [isRunning, setIsRunning] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<boolean[][]>([])
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    gridRef.current = createGrid('random')
    drawGrid(ctx, gridRef.current)
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
  }, [isRunning])

  useEffect(() => {
    if (!canvasContainerRef.current) return

    const container = canvasContainerRef.current

    container.scrollLeft = (CANVAS_WIDTH - container.clientWidth) / 2
    container.scrollTop = (CANVAS_HEIGHT - container.clientHeight) / 2

    let pos = { top: 0, left: 0, x: 0, y: 0 }

    const mouseDownHandler = (e: MouseEvent): void => {
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

    container.addEventListener('mousedown', mouseDownHandler)
  }, [])

  return (
    <div className="relative flex h-full max-h-screen flex-col items-center justify-center gap-4 py-4 md:py-6 lg:py-8">
      <div className="flex gap-4">
        <Button onClick={() => setIsRunning((prev) => !prev)}>
          {isRunning ? 'stop' : 'start'}
        </Button>
        <Button
          onClick={() => {
            gridRef.current = createGrid('random')
            drawGrid(canvasRef.current!.getContext('2d')!, gridRef.current)
          }}
        >
          randomize
        </Button>
      </div>

      <div
        ref={canvasContainerRef}
        className="h-full w-full cursor-grab overflow-auto rounded border border-white p-1"
      >
        <canvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          ref={canvasRef}
          className="h-fit w-fit"
        />
      </div>
    </div>
  )
}

const createGrid = (state: 'empty' | 'random'): boolean[][] => {
  const rows: boolean[][] = []

  for (let rowIdx = 0; rowIdx < ROWS_COUNT; rowIdx++) {
    rows.push([])

    for (let colIdx = 0; colIdx < COLS_COUNT; colIdx++) {
      rows[rowIdx].push(state === 'empty' ? false : Math.random() > 0.8)
    }
  }

  return rows
}

const drawGrid = (ctx: CanvasRenderingContext2D, grid: boolean[][]): void => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  const aliveCells: number[][] = []
  const deadCells: number[][] = []

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellIdx * (CELL_SIZE + GAP) + PADDING_OFFSET
      const y = rowIdx * (CELL_SIZE + GAP) + PADDING_OFFSET

      cell ? aliveCells.push([x, y]) : deadCells.push([x, y])
    })
  })

  drawRoundedRects({
    ctx,
    coords: aliveCells,
    color: tailwindColors.orange,
    w: CELL_SIZE,
    h: CELL_SIZE,
  })
  drawRoundedRects({
    ctx,
    coords: deadCells,
    color: tailwindColors.black,
    w: CELL_SIZE,
    h: CELL_SIZE,
  })
}

const updateGrid = (prevGrid: boolean[][]): boolean[][] => {
  const nextGrid = createGrid('empty')

  for (let rowIdx = 0; rowIdx < ROWS_COUNT; rowIdx++) {
    for (let colIdx = 0; colIdx < COLS_COUNT; colIdx++) {
      const cell = prevGrid[rowIdx][colIdx]

      let neighbors = 0

      operations.forEach(([x, y]) => {
        const newRow = (rowIdx + x + ROWS_COUNT) % ROWS_COUNT
        const newCol = (colIdx + y + COLS_COUNT) % COLS_COUNT

        neighbors += prevGrid[newRow][newCol] ? 1 : 0
      })

      if (neighbors < 2 || neighbors > 3) {
        nextGrid[rowIdx][colIdx] = false
      } else if (!cell && neighbors === 3) {
        nextGrid[rowIdx][colIdx] = true
      } else {
        nextGrid[rowIdx][colIdx] = cell
      }
    }
  }

  return nextGrid
}
