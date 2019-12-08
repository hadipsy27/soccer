// function resultKlasemen(data) {
// 	var tbDataKlasemen = '<center><h2>Data Klasemen</h2></center>';
// 	var str = JSON.stringify(data).replace(/http:/g, 'https:');
// 	data = JSON.parse(str);
// 	// var dataKlasemen = data;
// 	data.standings.forEach(function (klasemen) {
// 		var dbklasemenHtml = '';
// 		klasemen.table.forEach(function (team) {
// 			dbklasemenHtml += `
// 				<tr>
// 					<td>${team.position}</td>
// 					<td><img class="responsive-img" width="20" height="20" src="${ team.team.crestUrl}"> ${team.team.name}</td>
// 					<td>${team.playedGames}</td>
// 					<td>${team.won}</td>
// 					<td>${team.draw}</td>
// 					<td>${team.lost}</td>
// 					<td>${team.goalsFor}</td>
// 					<td>${team.goalsAgainst}</td>
// 					<td>${team.goalDifference}</td>
// 					<td>${team.points}</td>
// 				</tr>
// 		`;
// 		})
// 		tbDataKlasemen += `
// 		<div class="card">
// 		<div class="card-content">
// 		</div>

// 		<table class="responsive-table striped">
// 			<thead>
// 				<tr>
// 					<th>Posisi</th>
// 					<th>Tim</th>
// 					<th>Bermain</th>
// 					<th>Menang</th>
// 					<th>Seri</th>
// 					<th>Kalah</th>
// 					<th>GF</th>
// 					<th>GA</th>
// 					<th>GD</th>
// 					<th>Poin</th>
// 				</tr>
// 			</thead>
// 			<tbody>` + dbklasemenHtml + `</tbody>
// 		</table>
// 	</div>
// 		`
// 	});
// 	document.getElementById("klasemen").innerHTML = tbDataKlasemen;
// }