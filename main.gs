var TOTAL_BUDGET = 102

function updateButton() {
  updateData('resumen')
  getBestTeam()
}

function historyButton() {
  updateHistory()
}


function getData(){
  var url = "https://fantasy-api.formula1.com/f1/2022/players?v=1"
  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());
  
  return data
}

function updateData(tipo){
  var data = getData()
  var players = data.players
  var parsedDrivers = []
  var parsedConstructors = []

  players.forEach(function(pl){
    var name = [pl.first_name, pl.last_name].join(' ')
    var points = pl.season_score
    var price = pl.price
    var value = parseFloat(points / price).toFixed(2)
    var isConstructor = pl.position == 'Constructor' ? true : false
    var player = [name, points, price, value]
    
    if(isConstructor)
      parsedConstructors.push(player)
    else
      parsedDrivers.push(player)
  })

  parsedConstructors.sort(sortByValue)
  parsedDrivers.sort(sortByValue)
  if(tipo == 'resumen')
    writePlayers(parsedDrivers, parsedConstructors)
  else if(tipo == 'constructores')
    getTeams(parsedDrivers, parsedConstructors)
}

function writePlayers(drivers, constructors){
  ssActive = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Resumen');

  var rangeDrivers = 'A5:D' + (drivers.length + 4);
  rgMyRangeDrivers = ssActive.getRange(rangeDrivers);
  rgMyRangeDrivers.setValues(drivers);

  var rangeConstructors = 'F5:I' + (constructors.length + 4)
  rgMyRangeConstructors = ssActive.getRange(rangeConstructors);
  rgMyRangeConstructors.setValues(constructors)

  getTeams2(drivers, constructors)
}


function getTeams2(drivers, constructors){
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var header = ['Driver1', 'Driver2',	'Driver3', 'Driver4', 'Driver5', 'Price', 'Points', 'Total']

  constructors.forEach(function(cons){
    var teams = calculatePossibleTeams(drivers, cons[2], cons[1])
    teams.sort(sortByPoints)

    ssActive = activeSpreadsheet.getSheetByName(cons[0]);

    rangeTitle = "A1:A1"
    ssActive.getRange(rangeTitle).setValue(cons[0]);

    rangeHeader = 'A2:H2'
    ssActive.getRange(rangeHeader).setValues([header]);

    rangeTeams = 'A3:H' + (teams.length + 2)
    ssActive.getRange(rangeTeams).setValues(teams);
  })
}

function calculatePossibleTeams(drivers, consprice, conspoints){
  var teams = []
  var budget = TOTAL_BUDGET - consprice
  var len = drivers.length
  var maxPoints = 0
  for(var i=0; i<len;i++){
    for(var j=i; j<len;j++){
      for(var k=j; k<len;k++){
        for(var l=k; l<len;l++){
          for(var m=l; m<len;m++){
            var price = drivers[i][2] + drivers[j][2] + drivers[k][2] + drivers[l][2] + drivers[m][2]
            var points = drivers[i][1] + drivers[j][1] + drivers[k][1] + drivers[l][1] + drivers[m][1]
            if(price <= budget && alldifferent(i,j,k,l,m) && points >= maxPoints){
              var team = [drivers[i][0], drivers[j][0], drivers[k][0], drivers[l][0], drivers[m][0], price, points, points+conspoints]
              teams.push(team)
              maxPoints = points
            }

          }
        }
      }
    }
  }
  return teams
}



function getBestTeam(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var active = ss.getSheetByName('Resumen');
  var bestTeam;
  var maxPoints = 0;
  var constNames = active.getRange('F5:F14').getValues();

  constNames.forEach(function(name){
    var consSheet = ss.getSheetByName(name);
    var points = consSheet.getRange('H3').getValue();
    var price = consSheet.getRange('F3').getValue();
    if(points > maxPoints){
      bestTeam = consSheet.getRange('A3:E3').getValues()[0].concat([name, points, price]);
      maxPoints = points;
    }
  })

  active.getRange('F19:M19').setValues([bestTeam]);
}