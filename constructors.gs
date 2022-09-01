function constructorsButton() {
  updateData('constructores')
}

function getTeams(drivers, constructors){
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ssActive = activeSpreadsheet.getSheetByName('Constructores');
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