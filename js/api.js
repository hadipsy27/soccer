const API_KEY = '108a8f05027f4f1dbaa17b4c48e4eefa';
const LEAGUE_ID = 2021;
var base_url = "https://api.football-data.org/v2/";
var url_tim = `${base_url}competitions/${LEAGUE_ID}/teams`;
var url_klasemen = `${base_url}competitions/${LEAGUE_ID}/standings`;
var dataTim;

var fetchApi = url => {
	return fetch(url, {
		headers: {
			'X-Auth-Token': API_KEY
		}
	});
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
	if (response.status !== 200) {
		console.log("Error : " + response.status);
		// Method reject() akan membuat blok catch terpanggil
		return Promise.reject(new Error(response.statusText));
	} else {
		// Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
		return Promise.resolve(response);
	}
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
	return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
	// Parameter error berasal dari Promise.reject()
	console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getKlasemen() {
	if ('caches' in window) {
		caches.match(url_klasemen).then(function (response) {
			if (response) {
				response.json().then(function (data) {
					resultKlasemen(data);

				});
			}
		});
	}

	fetchApi(url_klasemen)
		.then(status)
		.then(json)
		.then(function (data) {
			// console.log(data)
			resultKlasemen(data)
		})
		.catch(error);
}

function getTim() {
	var fetchTim = fetchApi(url_tim)
		.then(status)
		.then(json);
	return fetchTim;
}

function resultKlasemen(data) {
	var dbklasemenHtml = '';
	var klasemenTitle = `<center style ="font-weight: bold; font-size: 40px;">${data.competition.name}  </center>`;

	var str = JSON.stringify(data).replace(/http:/g, 'https:');
	data = JSON.parse(str);

	data.standings[0].table.forEach(function (club) {
		dbklasemenHtml += `
				<tr>
					<td>${club.position}</td>
					<td><img class="responsive-img" style="vertical-align:middle"  width="30" height="30" src="${club.team.crestUrl}"> ${club.team.name}</td>
					<td>${club.playedGames}</td>
					<td>${club.won}</td>
					<td>${club.draw}</td>
					<td>${club.lost}</td>
					<td>${club.goalsFor}</td>
					<td>${club.goalsAgainst}</td>
					<td>${club.goalDifference}</td>
					<td>${club.points}</td>
				</tr>
		`
	});
	document.getElementById("klasemen").innerHTML = dbklasemenHtml;
	document.getElementById("klasemenTitle").innerHTML = klasemenTitle;

}

function getTeams() {
	var teams = getTim();
	teams.then(function (data) {
		var str = JSON.stringify(data).replace(/http:/g, 'https:');
		data = JSON.parse(str);

		var dataTim = data;
		var timHtml = '<center><h4><b>Teams</b></h4></center>';
		timHtml = '';
		data.teams.forEach(function (team) {
			timHtml += `
				<div class="col s12 m6">
					<div class="card">
             <div class="card-content"> 
								<div class="center"><img width="50" height="50" src="${team.crestUrl}"></div>
								<div class="center"><h5>${team.name}</h5></div>
								<div class="center">${team.area.name}</div>
				
								<div class="card-action center">
								<a class="waves-effect waves-light btn" onclick="insertTeamListener(${team.id})">Add to Favorite</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		})
		document.getElementById("teams").innerHTML = timHtml;
	})
}

function getTimFav() {
	var teams = getFavTeams();
	teams.then(function (data) {

		dataTim = data;
		var favTimHtml = '';
		data.forEach(function (team) {
			favTimHtml += `
			<div class="col s12 m6">
					<div class="card">
             <div class="card-content"> 
								<div class="center"><img width="50" height="50" src="${team.crestUrl}"></div>
								<div class="center"><h5>${team.name}</h5></div>
								<div class="center">${team.area.name}</div>
				
								<div class="card-action center">
								<a class="waves-effect waves-light btn red" onclick="deleteTeamListener(${team.id})">Delete From Favorite</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		})
		document.getElementById("timFav").innerHTML = favTimHtml;
	})
}

// opereasi database indexedDB
var dbPromise = idb.open('football', 1, upgradeDb => {
	switch (upgradeDb.oldVersion) {
		case 0:
			upgradeDb.createObjectStore('tim', {
				'keyPath': 'id'
			})
	}
});

function insertTeam(tim) {
	dbPromise.then(function (db) {
		var tx = db.transaction('tim', 'readwrite');
		var store = tx.objectStore('tim')
		tim.createAt = new Date().getTime()
		store.put(tim)
		return tx.complete;

	}).then(function () {
		M.toast({
			html: `${tim.name} berhasil di simpan`
		})
		console.log("Pertandingan berhasil disimpan");

	}).catch(error => {
		console.error("Pertandingan gagal disimpan", error);

	});
}

function deleteTeam(idTim) {
	dbPromise.then(function (db) {
		var tx = db.transaction('tim', 'readwrite');
		var store = tx.objectStore('tim');
		store.delete(idTim);
		return tx.complete;
	}).then(function () {
		M.toast({
			html: 'Team berhasil dihapus'
		});
		if (Notification.permission === 'granted') {
			navigator.serviceWorker.ready.then(function (registration) {
				registration.showNotification("Menghapus dari favorit");
			});
		} else {
			console.error("Fitur notifikasi tidak diijinkan");

		}
		getTimFav();
	}).catch(error => {
		console.error('Error', error);

	});
}

var getFavTeams = () => {
	return dbPromise.then(function (db) {
		var tx = db.transaction('tim', 'readonly');
		var store = tx.objectStore('tim');
		return store.getAll();
	})
}

var insertTeamListener = idTim => {
	var tim = dataTim.teams.filter(el => el.id == idTim)[0]
	insertTeam(tim);
}

var deleteTeamListener = idTim => {
	var conf = confirm("Anda yakin ingin menghapus?")
	if (conf == true) {
		deleteTeam(idTim);


	}
}