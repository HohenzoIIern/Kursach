'use strict';

const start = new Date();

function squareSums(n) {
  const numberSet = new Set();
  const squares = new Set();
  for (let i = 1; i * i < 2 * n; i++) {
    squares.add(i * i);
  }
  for (let i = 1; i <= n; i++) {
    numberSet.add(i);
  }

  function createAdjMatrix(n) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
      matrix.push([]);
      for (let j = 0; j < n; j++) {
        matrix[i].push(squares.has(i + j + 2) && i !== j);
      }
    }
    return matrix;
  }

  function firstProcedure(m, path) {
    let present = path[path.length - 1];
    const extended = [...path];
    const visited = new Set(extended);
    for (let k = 0; k < m.length; k++) {
      const neighbor = [];
      for (let i = 0; i < m.length; i++) {
        if (m[present][i] && !visited.has(i)) {
          neighbor.push(i);
        }
      }
      if (neighbor.length === 0) {
        break;
      }
      let choice = neighbor[0];
      let minimum = m.length;
      for (let i = 0; i < neighbor.length; i++) {
        const next = [];
        for (let j = 0; j < m.length; j++) {
          if (m[neighbor[i]][j] && !visited.has(j)) {
            next.push(j);
          }
          const eta = next.length;
          if (eta < minimum) {
            choice = neighbor[i];
            minimum = eta;
          }
        }
      }
      present = choice;
      visited.add(present);
      extended.push(present);
    }
    return extended;
  }

  function secondProcedure(m, path) {
    while (true) {
      const length = path.length;
      let inlet = -1;
      let outlet = -1;
      const neighbor = [];
      for (let i = 0; i < path.length; i++) {
        if (m[path[length - 1]][path[i]]) {
          neighbor.push(i);
        }
      }
      const unvisited = [];
      for (let i = 0; i < m.length; i++) {
        let outside = true;
        for (let j = 0; j < path.length; j++) {
          if (path[j] === i) {
            outside = false;
          }
        }
        if (outside) {
          unvisited.push(i);
        }
      }
      if (unvisited.length > 0 && neighbor.length > 0) {
        let maximum = 0;
        for (let i = 0; i < neighbor.length; i++) {
          for (let j = 0; j < unvisited.length; j++) {
            if (m[path[neighbor[i] + 1]][unvisited[j]]) {
              const next = [];
              for (let k = 0; k < unvisited.length; k++) {
                if (m[unvisited[j]][unvisited[k]]) {
                  next.push(unvisited[k]);
                }
              }
              const eta = next.length;
              if (eta >= maximum) {
                inlet = neighbor[i];
                outlet = unvisited[j];
                maximum = eta;
              }
            }
          }
        }
      }
      const extended = [];
      if (inlet !== -1 && outlet !== -1) {
        for (let i = 0; i <= inlet; i++) {
          extended.push(path[i]);
        }
        for (let i = path.length - 1; i > inlet; i--) {
          extended.push(path[i]);
        }
        extended.push(outlet);
      }
      if (extended.length > 0) {
        path = extended;
      }
      if (length < path.length) {
        path = firstProcedure(m, path);
      } else {
        break;
      }
    }
    return path;
  }

  function extraProcedure(m, path) {
    while (true) {
      let extended = [];
      const length = path.length;
      const unvisited = [];
      for (let i = 0; i < n; i++) {
        let outside = true;
        for (let j = 0; j < path.length; j++) {
          if (i === path[j]) {
            outside = false;
          }
        }
        if (outside === true) {
          unvisited.push(i);
        }
      }
      let mainCheck = true;
      for (let i = 0; i < path.length; i++) {
        for (let j = 0; j < unvisited.length; j++) {
          if (m[unvisited[j]][path[i]]) {
            const temp = [];
            temp.push(unvisited[j]);
            let tempExtended = [];
            const tempVisited = [];
            for (let l = 0; l < n; l++) {
              tempVisited.push(0);
            }
            let present;
            for (let l = 0; l < temp.length; l++) {
              present = temp[l];
              tempVisited[present] = 1;
              tempExtended.push(present);
            }
            for (let l = 0; l < n; l++) {
              let missing = true;
              for (let k = 0; k < unvisited.length; k++) {
                if (l === unvisited[k]) {
                  missing = false;
                }
              }
              if (missing) {
                tempVisited[l] = 1;
              }
            }
            for (let l = 0; l < n; l++) {
              const neighbor = [];
              for (let l = 0; l < n; l++) {
                if (m[present][l] && tempVisited[l] === 0) {
                  neighbor.push(l);
                }
              }
              if (neighbor.length !== 0) {
                let choice = neighbor[0];
                let minimum = n + 1;
                for (let l = 0; l < neighbor.length; l++) {
                  const next = [];
                  for (let k = 0; k < n; k++) {
                    if (m[neighbor[l]][k] && tempVisited[k] === 0) {
                      next.push(k);
                    }
                  }
                  const eta = next.length;
                  if (eta < minimum) {
                    choice = neighbor[l];
                    minimum = eta;
                  }
                }
                present = choice;
                tempVisited[present] = 1;
                tempExtended.push(present);
              } else {
                break;
              }
            }
            let last = tempExtended[tempExtended.length - 1];
            let vj;
            let check = true;
            while (check && tempExtended.length > 0) {
              for (let p = path.length - 2; p > i; p--) {
                if (m[path[p]][last] && m[path[i + 1]][path[p + 1]]) {
                  check = false;
                  vj = p;
                  break;
                }
              }
              if (check) {
                tempExtended.pop();
                last = tempExtended[tempExtended.length - 1];
              }
            }
            if (!check) {
              const temp = [];
              for (let p = 0; p <= i; p++) {
                temp.push(path[p]);
              }
              for (let p = 0; p < tempExtended.length; p++) {
                temp.push(tempExtended[p]);
              }
              for (let p = vj; p > i; p--) {
                temp.push(path[p]);
              }
              for (let p = vj + 1; p < path.length; p++) {
                temp.push(path[p]);
              }
              tempExtended = temp;
              mainCheck = false;
              extended = tempExtended;
            }
          }
        }
        if (!mainCheck) {
          break;
        }
      }
      if (extended.length > 0) {
        path = extended;
      }
      path = secondProcedure(m, firstProcedure(m, path));
      if (length === path.length) {
        break;
      }
    }
    return path;
  }

  function reverseProcedure(m, path) {
    let reversed = path.reverse();
    reversed = extraProcedure(m, reversed);
    return reversed;
  }

  function hamiltonianPath(m) {
    for (let i = 0; i < n; i++) {
      let path = [i];
      path = secondProcedure(m, firstProcedure(m, path));
      if (path.length < n) {
        path = extraProcedure(m, path);
      }
      if (path.length < n) {
        path = reverseProcedure(m, path);
      }
      if (path.length === n) {
        path = path.map(x => ++x);
        return path;
      }
    }
    return false;
  }

  return hamiltonianPath(createAdjMatrix(n));
}

const result = squareSums(26);
console.log(result);
console.log(result.length);
const end = new Date();
console.log(end - start + ' ms');
