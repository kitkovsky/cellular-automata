import { type MutableRefObject, type RefObject } from 'react'
import {
  canvasConfig,
  type GenericAutomatonCell,
} from '@/components/AutomatonCanvas'
import { drawRoundedRects } from '@/utils/canvas.utils'
import { tailwindColors } from '~/tailwind.config'

enum GolCellState {
  ALIVE = 'alive',
  DEAD = 'dead',
}

export type GolCell = GenericAutomatonCell<GolCellState>

const GOL_CELLS: Record<GolCellState, GolCell> = {
  [GolCellState.ALIVE]: {
    state: GolCellState.ALIVE,
    color: tailwindColors.orange,
  },
  [GolCellState.DEAD]: {
    state: GolCellState.DEAD,
    color: tailwindColors.black,
  },
}

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

export const createGrid = (initialState: 'empty' | 'random'): GolCell[][] => {
  const rows: GolCell[][] = []

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    rows.push([])

    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      if (initialState === 'empty') {
        rows[rowIdx].push(GOL_CELLS.alive)
      } else {
        rows[rowIdx].push(
          Math.random() > 0.8 ? GOL_CELLS.alive : GOL_CELLS.dead,
        )
      }
    }
  }

  return rows
}

export const updateGrid = (prevGrid: GolCell[][]): GolCell[][] => {
  const nextGrid = createGrid('empty')

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      const cell = prevGrid[rowIdx][colIdx]

      let neighbors = 0

      operations.forEach(([x, y]) => {
        const newRow = (rowIdx + x + rowsCount) % rowsCount
        const newCol = (colIdx + y + colsCount) % colsCount

        if (
          (prevGrid[newRow][newCol].state as GolCellState) ===
          GolCellState.ALIVE
        )
          neighbors++
      })

      if (neighbors < 2 || neighbors > 3) {
        nextGrid[rowIdx][colIdx] = GOL_CELLS.dead
      } else if (
        (cell.state as GolCellState) === GolCellState.DEAD &&
        neighbors === 3
      ) {
        nextGrid[rowIdx][colIdx] = GOL_CELLS.alive
      } else {
        nextGrid[rowIdx][colIdx] = cell
      }
    }
  }

  return nextGrid
}

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: GolCell[][],
): void => {
  ctx.clearRect(0, 0, width(), height())

  const aliveCellsCoords: number[][] = []
  const deadCellsCoords: number[][] = []

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellIdx * (cellSize + gap) + paddingOffset
      const y = rowIdx * (cellSize + gap) + paddingOffset

      ;(cell.state as GolCellState) === GolCellState.ALIVE
        ? aliveCellsCoords.push([x, y])
        : deadCellsCoords.push([x, y])
    })
  })

  drawRoundedRects({
    ctx,
    coords: aliveCellsCoords,
    color: GOL_CELLS.alive.color,
    w: cellSize,
    h: cellSize,
  })
  drawRoundedRects({
    ctx,
    coords: deadCellsCoords,
    color: GOL_CELLS.dead.color,
    w: cellSize,
    h: cellSize,
  })
}

export const randomizeGrid = (
  gridRef: MutableRefObject<GolCell[][]>,
  canvasRef: RefObject<HTMLCanvasElement>,
): void => {
  gridRef.current = createGrid('random')
  drawGrid(canvasRef.current!.getContext('2d')!, gridRef.current)
}
