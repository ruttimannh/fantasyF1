function deepAnalysisButton() {
  var data = getAllData();

}

function getAllData(){
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Historico');
  var endColumn = getFirstEmptyColumn(ss, 3, 1);

  var data = ss.getRange(3,1, 30, endColumn - 1).getValues();
  var prices = findPrices();
  var consList = getConsNames();
  
  var drivers = [];
  var cons = [];
  data.forEach(function(row, i){
    var player = [];
    player.push(row[0]);
    player.push(row[row.length - 1] - row[row.length - 4]);
    player.push(prices[i][2]);
    if(consList.find(function(aux){return aux == row[0]}) != undefined)
      cons.push(player);
    else
      drivers.push(player);
  });
  writeLastRacesPoints(drivers.concat(cons));
  getTeamsLastRaces(drivers, cons);
}

function findPrices(){
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resumen');
  var drivers = ss.getRange(5, 1, 20, 3).getValues();
  var cons = ss.getRange(5, 6, 10, 3).getValues();

  var allData = drivers.concat(cons);
  return allData.sort(sortByName);
}

function getConsNames(){
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resumen');
  var cons = ss.getRange(5, 6, 10).getValues();
  var consNames = []
  cons.forEach(function(c){
    consNames.push(c[0])
  });
  return  consNames;
}

function getTeamsLastRaces(drivers, constructors){
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ssActive = activeSpreadsheet.getSheetByName('DeepAnalysis');
  var header = ['Driver1', 'Driver2',	'Driver3', 'Driver4', 'Driver5', 'Price', 'Points', 'Total']
  var previousRow = 1

  ssActive.getRange(1,1,100,8).clear();

  constructors.forEach(function(cons){
    var teams = calculatePossibleTeams(drivers, cons[2], cons[1])
    teams.sort(sortByPoints);
    
    var row = getFirstEmptyRow(ssActive, previousRow, 1)

    ssActive.getRange(row+1, 1).setValue(cons[0]);

    ssActive.getRange(row+2, 1, 1, 8).setValues([header]);

    ssActive.getRange(row+3, 1, teams.length, 8).setValues(teams);

    previousRow = row+1;
  })
}

function writeLastRacesPoints(players){
  var sortedPLayers = players.sort(sortByName);
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ssActive = activeSpreadsheet.getSheetByName('DeepAnalysis');

  var header = [['Name', 'Points', 'Price']];
  ssActive.getRange(1, 10, 1, 3).setValues(header);
  ssActive.getRange(2, 10, 30, 3).setValues(sortedPLayers);
  
}