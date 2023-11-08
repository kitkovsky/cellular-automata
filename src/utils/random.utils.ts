export const getWeightedRandom = <T>(options: Map<T, number>): T => {
  const weightsSum = parseFloat(
    Array.from(options.values())
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(4), // toFixed is needed to avoid floating point errors
  )
  if (weightsSum !== 1)
    throw new Error('Weights must sum to 1, current sum is ' + weightsSum)

  const random = Math.random()
  let acc = 0

  for (const [option, weight] of options) {
    acc += weight
    if (random <= acc) return option
  }

  throw new Error('Could not find option, this should never happen')
}
