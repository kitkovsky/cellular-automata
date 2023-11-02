import { type MutableRefObject, type RefObject } from 'react'
import {
  canvasConfig,
  type GenericAutomatonCell,
} from '@/components/AutomatonCanvas'
import { drawRoundedRects } from '@/utils/canvas.utils'
import { tailwindColors } from '~/tailwind.config'

enum SeedsCellState {
  ON = 'on',
  OFF = 'off',
}

export type SeedsCell = GenericAutomatonCell<SeedsCellState>

const SEEDS_CELLS: Record<SeedsCellState, SeedsCell> = {
  [SeedsCellState.ON]: {
    state: SeedsCellState.ON,
    color: tailwindColors.orange,
  },
  [SeedsCellState.OFF]: {
    state: SeedsCellState.OFF,
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

export const createGrid = (initialState: 'empty' | 'random'): SeedsCell[][] => {
  const rows: SeedsCell[][] = []
  const randomCellsBoundaries = {
    rowsMin: rowsCount / 2 - 5,
    rowsMax: rowsCount / 2 + 5,
    colsMin: colsCount / 2 - 5,
    colsMax: colsCount / 2 + 5,
  }

  const isInsideRandomCellsBoundaries = (
    rowIdx: number,
    colIdx: number,
  ): boolean =>
    rowIdx >= randomCellsBoundaries.rowsMin &&
    rowIdx <= randomCellsBoundaries.rowsMax &&
    colIdx >= randomCellsBoundaries.colsMin &&
    colIdx <= randomCellsBoundaries.colsMax

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    rows.push([])

    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      if (
        initialState === 'empty' ||
        !isInsideRandomCellsBoundaries(rowIdx, colIdx)
      ) {
        rows[rowIdx].push(SEEDS_CELLS.off)
      } else {
        rows[rowIdx].push(
          Math.random() > 0.8 ? SEEDS_CELLS.on : SEEDS_CELLS.off,
        )
      }
    }
  }

  return rows
}

export const updateGrid = (prevGrid: SeedsCell[][]): SeedsCell[][] => {
  const nextGrid = createGrid('empty')

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      const cell = prevGrid[rowIdx][colIdx]

      let onNeighborsCount = 0

      operations.forEach(([x, y]) => {
        const newRow = (rowIdx + x + rowsCount) % rowsCount
        const newCol = (colIdx + y + colsCount) % colsCount

        if (prevGrid[newRow][newCol].state === SeedsCellState.ON)
          onNeighborsCount++
      })

      if (cell.state === SeedsCellState.OFF && onNeighborsCount === 2) {
        nextGrid[rowIdx][colIdx] = SEEDS_CELLS.on
      } else {
        nextGrid[rowIdx][colIdx] = SEEDS_CELLS.off
      }
    }
  }

  return nextGrid
}

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: SeedsCell[][],
): void => {
  ctx.clearRect(0, 0, width(), height())

  const aliveCellsCoords: number[][] = []
  const deadCellsCoords: number[][] = []

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellIdx * (cellSize + gap) + paddingOffset
      const y = rowIdx * (cellSize + gap) + paddingOffset

      cell.state === SeedsCellState.ON
        ? aliveCellsCoords.push([x, y])
        : deadCellsCoords.push([x, y])
    })
  })

  drawRoundedRects({
    ctx,
    coords: aliveCellsCoords,
    color: SEEDS_CELLS.on.color,
    w: cellSize,
    h: cellSize,
  })
  drawRoundedRects({
    ctx,
    coords: deadCellsCoords,
    color: SEEDS_CELLS.off.color,
    w: cellSize,
    h: cellSize,
  })
}

export const randomizeGrid = (
  gridRef: MutableRefObject<SeedsCell[][]>,
  canvasRef: RefObject<HTMLCanvasElement>,
): void => {
  gridRef.current = createGrid('random')
  drawGrid(canvasRef.current!.getContext('2d')!, gridRef.current)
}
