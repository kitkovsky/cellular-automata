export const drawRoundedRects = ({
  ctx,
  coords,
  color,
  w,
  h,
  r = 1,
}: {
  ctx: CanvasRenderingContext2D
  coords: number[][]
  color: string
  w: number
  h: number
  r?: number
}): void => {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.beginPath()

  coords.forEach(([x, y]) => {
    ctx.roundRect(x, y, w, h, r)
  })

  ctx.stroke()
  ctx.fill()
}
