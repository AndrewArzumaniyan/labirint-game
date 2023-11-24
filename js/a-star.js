export function shortestPathWithRoute(matrix, start, target) {
  const queue = [[start[0], start[1], 0, [start]]]
  const visited = new Set()

  visited.add(`${start[0]}, ${start[1]}`)

  while (queue.length > 0) {
    const [x, y, steps, path] = queue.shift()
    
    if (x === target[0] && y === target[1])
      return path

      addNeighborsWithRoute(queue, visited, matrix, x, y, steps, path)
  }

  return []
}

export function searchInMatrix(matrix, searchEl) {
  let res = []
  console.log(matrix)
  console.log(searchEl)
  matrix.forEach((row, i) => {
    row.forEach((el, j) => {
      if (el.id === searchEl.id)
        res.push(i)
        res.push(j)
        return res;
    })
  });

  return null;
}

function addNeighborsWithRoute(queue, visited, matrix, x, y, steps, path) {
  const rows = matrix.length
  const cols = matrix[0].length
  const directions = [[1,0],[-1,0],[0,1],[0,-1]]

  for (const [dx, dy] of directions) {
    const nx = x + dx
    const ny = y + dy

    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && matrix[nx][ny] !== 0 && !(`${nx},${ny}` in visited)) {
      const newPath = [...path, [nx, ny]]
      queue.push([nx, ny, steps + 1, newPath])
      visited.add(`${nx},${ny}`)
    }
  }
}