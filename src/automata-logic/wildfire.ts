import { type MutableRefObject, type RefObject } from 'react'
import {
  canvasConfig,
  type GenericAutomatonCell,
} from '@/components/AutomatonCanvas'
import { drawRoundedRects } from '@/utils/canvas.utils'
import { getWeightedRandom } from '@/utils/random.utils'
import { tailwindColors } from '~/tailwind.config'

enum WFCellState {
  BURNING = 'burning',
  WITH_FUEL_NOT_BURNED = 'with_fuel_not_burned',
  FUEL_FREE = 'fuel_free',
  BURNED = 'burned',
}

export type WFCell = GenericAutomatonCell<WFCellState>

const WF_CELLS: Record<WFCellState, WFCell> = {
  [WFCellState.BURNING]: {
    state: WFCellState.BURNING,
    color: tailwindColors.red,
  },
  [WFCellState.WITH_FUEL_NOT_BURNED]: {
    state: WFCellState.WITH_FUEL_NOT_BURNED,
    color: tailwindColors.aqua,
  },
  [WFCellState.FUEL_FREE]: {
    state: WFCellState.FUEL_FREE,
    color: tailwindColors.gray40,
  },
  [WFCellState.BURNED]: {
    state: WFCellState.BURNED,
    color: tailwindColors.black,
  },
}

const willBurn = (
  burningNeighborsCount: number,
  state: WFCellState,
): boolean => {
  const pBurn = burningNeighborsCount * 0.33 || 0.000001

  return state === WFCellState.WITH_FUEL_NOT_BURNED && pBurn > Math.random()
}

const willRegrow = (
  burningNeighborsCount: number,
  notBurnedNeighborsCount: number,
  state: WFCellState,
): boolean => {
  const pRegrow = notBurnedNeighborsCount * 0.006

  return (
    state === WFCellState.BURNED &&
    burningNeighborsCount === 0 &&
    pRegrow > Math.random()
  )
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

export const createGrid = (initialState: 'empty' | 'random'): WFCell[][] => {
  const rows: WFCell[][] = []

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    rows.push([])

    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      if (initialState === 'empty') {
        rows[rowIdx].push(WF_CELLS.burned)
      } else {
        rows[rowIdx].push(
          getWeightedRandom(
            new Map([
              [WF_CELLS.fuel_free, 0.1],
              [WF_CELLS.burning, 0.0001],
              [WF_CELLS.with_fuel_not_burned, 0.8999],
            ]),
          ),
        )
      }
    }
  }

  return rows
}

export const updateGrid = (prevGrid: WFCell[][]): WFCell[][] => {
  const nextGrid = createGrid('empty')

  for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
    for (let colIdx = 0; colIdx < colsCount; colIdx++) {
      const cell = prevGrid[rowIdx][colIdx]

      let burningNeighborsCount = 0
      let notBurnedNeighborsCount = 0

      operations.forEach(([x, y]) => {
        const newRow = (rowIdx + x + rowsCount) % rowsCount
        const newCol = (colIdx + y + colsCount) % colsCount

        switch (prevGrid[newRow][newCol].state) {
          case WFCellState.BURNING:
            burningNeighborsCount++
            break
          case WFCellState.WITH_FUEL_NOT_BURNED:
            notBurnedNeighborsCount++
            break
          default:
            break
        }
      })

      if (willBurn(burningNeighborsCount, cell.state)) {
        nextGrid[rowIdx][colIdx] = WF_CELLS.burning
      } else if (
        willRegrow(burningNeighborsCount, notBurnedNeighborsCount, cell.state)
      ) {
        nextGrid[rowIdx][colIdx] = WF_CELLS.with_fuel_not_burned
      } else if (cell.state === WFCellState.BURNING) {
        nextGrid[rowIdx][colIdx] = WF_CELLS.burned
      } else {
        nextGrid[rowIdx][colIdx] = cell
      }
    }
  }

  return nextGrid
}

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: WFCell[][],
): void => {
  ctx.clearRect(0, 0, width(), height())

  const cellCoords: Record<WFCellState, number[][]> = {
    [WFCellState.BURNING]: [],
    [WFCellState.WITH_FUEL_NOT_BURNED]: [],
    [WFCellState.FUEL_FREE]: [],
    [WFCellState.BURNED]: [],
  }

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const x = cellIdx * (cellSize + gap) + paddingOffset
      const y = rowIdx * (cellSize + gap) + paddingOffset

      cellCoords[cell.state].push([x, y])
    })
  })

  Object.entries(cellCoords).forEach(([state, coords]) =>
    drawRoundedRects({
      ctx,
      coords,
      color: WF_CELLS[state as WFCellState].color,
      w: cellSize,
      h: cellSize,
    }),
  )
}

export const randomizeGrid = (
  gridRef: MutableRefObject<WFCell[][]>,
  canvasRef: RefObject<HTMLCanvasElement>,
): void => {
  gridRef.current = createGrid('random')
  drawGrid(canvasRef.current!.getContext('2d')!, gridRef.current)
}
