import { type MutableRefObject, type RefObject } from 'react'
import { canvasConfig } from '@/components/AutomatonCanvas'
import { drawRoundedRects } from '@/utils/canvas.utils'
import { tailwindColors } from '~/tailwind.config'

const { rowsCount, colsCount, width, height, gap, paddingOffset, cellSize } =
  canvasConfig
const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const

export const createGrid = (state: 'empty' | 'random'): boolean[][] => {
  const rows: boolean[][] = []

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    rows.push([])

    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      rows[rowIdx].push(state === 'empty' ? false : Math.random() > 0.8)
    }
  }

  return rows
}

export const updateGrid = (prevGrid: boolean[][]): boolean[][] => {
  const nextGrid = createGrid('empty')

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      const cell = prevGrid[rowIdx][colIdx]

      let neighbors = 0

      operations.forEach(([x, y]) => {
        const newRow = (rowIdx + x + rowsCount) % rowsCount
        const newCol = (colIdx + y + colsCount) % colsCount

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

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: boolean[][],
): void => {
  ctx.clearRect(0, 0, width(), height())

  const aliveCells: number[][] = []
  const deadCells: number[][] = []

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellIdx * (cellSize + gap) + paddingOffset
      const y = rowIdx * (cellSize + gap) + paddingOffset

      cell ? aliveCells.push([x, y]) : deadCells.push([x, y])
    })
  })

  drawRoundedRects({
    ctx,
    coords: aliveCells,
    color: tailwindColors.orange,
    w: cellSize,
    h: cellSize,
  })
  drawRoundedRects({
    ctx,
    coords: deadCells,
    color: tailwindColors.black,
    w: cellSize,
    h: cellSize,
  })
}

export const randomizeGrid = (
  gridRef: MutableRefObject<boolean[][]>,
  canvasRef: RefObject<HTMLCanvasElement>,
): void => {
  gridRef.current = createGrid('random')
  drawGrid(canvasRef.current!.getContext('2d')!, gridRef.current)
}
