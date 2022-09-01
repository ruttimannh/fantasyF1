function updateHistory(){
  var data = getData()
  var players = parsePlayers(data)
  var points = players.map(x => [x[1]])
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var active = ss.getSheetByName('Historico');
  var range = getFirstEmptyColumn(active, 3, 1)
  active.getRange(3, range, players.length, 1).setValues(points)
}

function parsePlayers(data){
  var parsedPlayers = []
  var players = data.players
  players.forEach(function(pl){
    var name = [pl.first_name, pl.last_name].join(' ')
    var points = pl.season_score
    var player = [name, points]
    parsedPlayers.push(player)
  })

  parsedPlayers.sort(sortByName)
  return parsedPlayers
}

