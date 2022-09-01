function getFirstEmptyColumn(active,row, startColumn){
  var offset = 0
  while(active.getRange(row, startColumn+offset).getValue() != ""){
    offset++
  }

  return offset+1
}

function sortByName(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? 1 : -1;
    }
}

function alldifferent(i,j,k,l,m){
  if(i != j && i != k && i != l  && i != m && j != k && j != l && j != m && k != l && k != m && l != m)
    return true
  return false
}

function sortByValue(a, b) {
    if (parseFloat(a[3]) === parseFloat(b[3])) {
        return 0;
    }
    else {
        return (parseFloat(a[3]) < parseFloat(b[3])) ? 1 : -1;
    }
}

function sortByPoints(a, b) {
    if (a[7] === b[7]) {
        return 0;
    }
    else {
        return (a[7] < b[7]) ? 1 : -1;
    }
}

function getFirstEmptyRow(active,startRow, column){
  var offset = 0
  while(active.getRange(startRow+offset, column).getValue() != ""){
    offset++
  }

  return startRow+offset
}
