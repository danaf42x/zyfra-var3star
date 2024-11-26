const { Client } = require("pg");

// настройка {{{

	const pgclient = new Client({
		user: 'admin',
		password: 'admin',
		host: 'localhost',
		port: '5432',
		database: 'zyfra',
	});

	pgclient.connect().then(() => {
		console.log("Подключились к БД");
	}).catch((err) => {
		console.error("Ошибка подключения к БД:", err);
	});

// }}}

// методы управления БД {{{

	function db_GetObject(objId) {
		pgclient.query('SELECT * FROM objects WHERE id = $1', [objId], (err, result) => {
			if (err) {
				console.error("Ошибка запроса к БД", err);
			} else {
				return result.rows[0];
			}
		});
	}

	function db_UpdateObject(objId, obj) {
		pgclient.query('UPDATE object SET col1 = $1, col2 = $2, col3 = $3 WHERE id = $4', [obj.col1, obj.col2, obj.col3, objId], (err, result) => {
			if (err) {
				console.error("Ошибка обновления данных БД", err);
			} else {
				return true;
			}
		});
	}

// }}}
