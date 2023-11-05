import { type MutableRefObject, type RefObject } from 'react'
import {
  canvasConfig,
  type GenericAutomatonCell,
} from '@/components/AutomatonCanvas'
import { drawRoundedRects } from '@/utils/canvas.utils'
import { tailwindColors } from '~/tailwind.config'

enum BBCellState {
  ON = 'on',
  OFF = 'off',
  DYING = 'dying',
}

export type BBCell = GenericAutomatonCell<BBCellState>

const BB_CELLS: Record<BBCellState, BBCell> = {
  [BBCellState.ON]: {
    state: BBCellState.ON,
    color: tailwindColors.orange,
  },
  [BBCellState.OFF]: {
    state: BBCellState.OFF,
    color: tailwindColors.black,
  },
  [BBCellState.DYING]: {
    state: BBCellState.DYING,
    color: tailwindColors.white,
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

export const createGrid = (initialState: 'empty' | 'random'): BBCell[][] => {
  const rows: BBCell[][] = []
  const randomCellsBoundaries = {
    rowsMin: rowsCount / 2 - 10,
    rowsMax: rowsCount / 2 + 10,
    colsMin: colsCount / 2 - 10,
    colsMax: colsCount / 2 + 10,
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
        rows[rowIdx].push(BB_CELLS.off)
      } else {
        rows[rowIdx].push(Math.random() > 0.8 ? BB_CELLS.on : BB_CELLS.off)
      }
    }
  }

  return rows
}

export const updateGrid = (prevGrid: BBCell[][]): BBCell[][] => {
  const nextGrid = createGrid('empty')

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      const cell = prevGrid[rowIdx][colIdx]

      let onNeighborsCount = 0

      operations.forEach(([x, y]) => {
        const newRow = (rowIdx + x + rowsCount) % rowsCount
        const newCol = (colIdx + y + colsCount) % colsCount

        if (prevGrid[newRow][newCol].state === BBCellState.ON)
          onNeighborsCount++
      })

      if (cell.state === BBCellState.OFF && onNeighborsCount === 2) {
        nextGrid[rowIdx][colIdx] = BB_CELLS.on
      } else if (cell.state === BBCellState.ON) {
        nextGrid[rowIdx][colIdx] = BB_CELLS.dying
      } else if (cell.state === BBCellState.DYING) {
        nextGrid[rowIdx][colIdx] = BB_CELLS.off
      } else {
        nextGrid[rowIdx][colIdx] = BB_CELLS.off
      }
    }
  }

  return nextGrid
}

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: BBCell[][],
): void => {
  ctx.clearRect(0, 0, width(), height())

  const onCellCoords: number[][] = []
  const offCellsCoords: number[][] = []
  const dyingCellsCoords: number[][] = []

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellIdx * (cellSize + gap) + paddingOffset
      const y = rowIdx * (cellSize + gap) + paddingOffset

      switch (cell.state) {
        case BBCellState.ON:
          onCellCoords.push([x, y])
          break
        case BBCellState.DYING:
          dyingCellsCoords.push([x, y])
          break
        case BBCellState.OFF:
          offCellsCoords.push([x, y])
          break
      }
    })
  })

  drawRoundedRects({
    ctx,
    coords: onCellCoords,
    color: BB_CELLS.on.color,
    w: cellSize,
    h: cellSize,
  })
  drawRoundedRects({
    ctx,
    coords: offCellsCoords,
    color: BB_CELLS.off.color,
    w: cellSize,
    h: cellSize,
  })
  drawRoundedRects({
    ctx,
    coords: dyingCellsCoords,
    color: BB_CELLS.dying.color,
    w: cellSize,
    h: cellSize,
  })
}

export const randomizeGrid = (
  gridRef: MutableRefObject<BBCell[][]>,
  canvasRef: RefObject<HTMLCanvasElement>,
): void => {
  gridRef.current = createGrid('random')
  drawGrid(canvasRef.current!.getContext('2d')!, gridRef.current)
}
