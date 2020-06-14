'use strict';
let start = new Date();
function square_sums_row(n) {
  let set = new Set;
  let Squares = new Set;
  for(let i=1;i*i<2*n;i++){
    Squares.add(i*i);
  }
  for(let i=1;i<=n;i++){
    set.add(i);
  }
  function CreateAdjMatrix(n){
    let Matrix = [];
    for(let i=0;i<=n;i++){
      Matrix.push([]);
      for(let j=0;j<=n;j++){
        if((Squares.has(i+j)) && i!==j && i!==0 && j!==0){//|| i===0 || j===0
          Matrix[i].push(1);
        }else {
          Matrix[i].push(0);
        }
      }
    }
    return Matrix
  }
  function part1(M,Path) {
    let extended = [];
    let visited = [];
    let present;
    for(let i=0;i<M.length;i++){
      visited.push(0);
    }
    for(let i=0;i<Path.length;i++){
      present = Path[i];
      visited[present] = 1;
      extended.push(present);
    }
    for(let k=0;k<M.length;k++){
      let neighbor = [];
      for(let i=0;i<M.length;i++){
        if(M[present][i]===1 && visited[i]===0){
          neighbor.push(i);
        }
      }
      if(neighbor.length!==0){
        let choice = neighbor[0];
        let minimum = M.length;
        for(let i=0;i<neighbor.length;i++){
          let next = [];
          for(let j=0;j<M.length;j++){
            if(M[neighbor[i]][j]===1 && visited[j]===0){
              next.push(j);
            }
            let eta = next.length;
            if(eta<minimum){
              choice = neighbor[i];
              minimum = eta;
            }
          }
        }
        present = choice;
        visited[present]=1;
        extended.push(present);
      }
      else break
    }
    return extended;
  }
  function part2(M,Path) {
    let quit = false;
    while(quit!==true){
      let m = Path.length;
      let inlet = -1;
      let outlet = -1;
      let neighbor = [];
      for(let i=0; i<Path.length; i++){
        if(M[Path[m-1]][Path[i]]===1){
          neighbor.push(i);
        }
      }
      let unvisited = [];
      for(let i=0;i<M.length;i++){
        let outside = true;
        for(let j=0;j<Path.length;j++){
          if(Path[j]===i){
            outside = false;
          }
        }
        if(outside===true){
          unvisited.push(i);
        }
      }
      if(unvisited.length!==0 && neighbor.length!==0){
        let maximum = 0;
        for(let i=0;i<neighbor.length;i++){
          for(let j=0;j<unvisited.length;j++){
            if(M[Path[neighbor[i]+1]][unvisited[j]]===1){
              let next = [];
              for(let k=0;k<unvisited.length;k++){
                if(M[unvisited[j]][unvisited[k]]===1){
                  next.push(unvisited[k]);
                }
              }
              let eta = next.length;
              if(eta>=maximum){
                inlet = neighbor[i];
                outlet = unvisited[j];
                maximum = eta;
              }

            }
          }
        }
      }
      let extended = [];
      if(inlet!==-1 && outlet!==-1){
        for(let i=0;i<=inlet; i++){
          extended.push(Path[i]);
        }
        for(let i=Path.length-1;i>inlet;i--){
          extended.push(Path[i]);
        }
        extended.push(outlet);
      }
      if(extended.length!==0){
        Path = extended;
      }
      if(m<Path.length){
        Path = part1(M,Path)
      }else {
        quit = true;
      }
    }
    return Path
  }
  function part2b(M,Path) {
    let quit = false;
    while(!quit){
      let extended = [];
      let m=Path.length;
      let unvisited = [];
      for(let i=1; i<=n; i++) {
        let outside=true;
        for(let j=0; j<Path.length; j++){
          if(i===Path[j]) {outside=false;}
        }
        if(outside===true) unvisited.push(i);
      }
      let big_check=false;
      for(let i=0; i<Path.length; i++)
      {
        for(let j=0; j<unvisited.length; j++)
        {
          if(M[unvisited[j]][Path[i]]===1)
          {
            let temp = [];
            temp.push(unvisited[j]);
            let temp_extended =[];
            let temp_visited =[];
            for(let l=1; l<=n; l++)
              temp_visited.push(0);
            let present;
            for(let l=0; l<temp.length; l++)
            {
              present=temp[l];
              temp_visited[present]=1;
              temp_extended.push(present);
            }
            for(let l=1; l<=n; l++)
            {
              let unfound=true;
              for(let k=0; k<unvisited.length; k++)
                if(l===unvisited[k]) unfound=false;
              if(unfound===true) temp_visited[l]=1;
            }
            for(let l=0; l<=n; l++)
            {
              let neighbor =[];
              for(l=1; l<=n; l++)
                if(M[present][l]===1 && temp_visited[l]===0)
                  neighbor.push(l);
              if(neighbor.length!==0)
              {
                let choice=neighbor[0];
                let minimum=n+1;
                for(let l=0; l<neighbor.length; l++)
                {
                  let next = [];
                  for(let k=1; k<=n; k++)
                    if(M[neighbor[l]][k]===1 && temp_visited[k]===0)
                      next.push(k);
                  let eta=next.length;
                  if(eta<minimum)
                  {
                    choice=neighbor[l];
                    minimum=eta;
                  }
                }
                present=choice;
                temp_visited[present]=1;
                temp_extended.push(present);
              }
              else break;
            }
            let last=temp_extended[temp_extended.length-1];
            let vj;
            let check=false;
            while(check===false && temp_extended.length!==0)
            {
              for(let p=Path.length-2; p>i; p--)
              {
                if(M[Path[p]][last]===1
                  && M[Path[i+1]][Path[p+1]]===1)
                {
                  check=true;
                  vj=p;
                  break;
                }
              }
              if(check===false)
              {
                temp_extended.pop();
                last=temp_extended[temp_extended.length-1];
              }
            }
            if(check===true)
            {
              let temp = [];
              for(let p=0; p<=i; p++){
                temp.push(Path[p]);
              }
              for(let p=0; p<temp_extended.length; p++)
                temp.push(temp_extended[p]);
              for(let p=vj; p>i; p--)
                temp.push(Path[p]);
              for(let p=vj+1; p<Path.length; p++)
                temp.push(Path[p]);
              temp_extended=temp;
              big_check=true;
              extended=temp_extended;
            }
          }
        }
        if(big_check===true)
        {
          break;
        }
      }
      if(extended.length!==0) Path=extended;
      if(m<Path.length) {
        Path=part1(M,Path);
        Path=part2(M,Path);
      }
      else quit=true;
    }
    return Path
  }
  function part2c(M,Path) {
    let reversed = Path.reverse();
    reversed=part2b(M,reversed);
    return reversed;
  }
  function HamiltonianPath(M){
    for(let i=1;i<=n;i++){
      let Path = [i];
      console.log(i);
      Path = part2(M,part1(M,Path));
      Path = part1(M,Path);
      console.log(Path.length+'len');
      if(Path.length<n){
        Path = part2b(M,Path);
      }
      if(Path.length<n){
        Path = part2c(M,Path);
      }
      if(Path.length===n) {
        return Path
      }
    }
    return false;
  }
  return HamiltonianPath(CreateAdjMatrix(n))
}
let S = square_sums_row(26);//23 26 29 30 57 59 83 are not working
console.log(S);
console.log(S.length);
let end = new Date();
console.log(end-start+' ms');