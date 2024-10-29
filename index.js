// инициализация {{{

	const fs = require("node:fs");
	const readline = require("readline");
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	function input(q) {
		return new Promise( (r) => {
			rl.question(q, r);
		});
	}

// }}}

// стартовое состояние ОМ {{{

	const objectModel = {};
	{
		// TODO каков формат входных данных?

		const omTemplate = fs.readFileSync(__dirname + "/om.txt", { encoding: "utf8", flag: "r" });
		const fieldDatas = omTemplate.split(", ");
		for (let fieldData of Object.values(fieldDatas)) {
			const s = fieldData.split(": ");
			const fieldName = s[0];
			const fieldType = s[1];
			objectModel[fieldName] = fieldType;
		}
	}

// }}}

// кэш {{{

	const cache = {};
	const cacheLastAccess = {}; // хранит время последнего получения
	const DELAY = 10;

	function cache_GetObject(objId) {
		const now = Date.now()
		if (cache[objId] && (!cacheLastAccess[objId] || (now - cacheLastAccess[objId] > DELAY))) {
			if (now - cacheLastAccess > DELAY)
				cacheLastAccess[objId] = now;

			return cache[objId];
		} else {
			// TODO кэш откуда-то берет объекты
		}
	}

	function cache_GetObjectProperty(objId, propertyName) {
		const obj = cache_GetObject(objId)
		if (obj) {
			return obj[ propertyName ];
		}
	}

	function cache_SetObjectProperty(objId, propertyName, value) {
		const obj = cache_GetObject(objId)

		if (obj && typeof value == objectModel[propertyName]) {
			cacheLastAccess[objId] = Date.now();
			obj[propertyName] = value;
		}

		return false
	}

	function cache_Clear() {
		for (let objId of Object.keys(cacheLastAccess)) {
			cacheLastAccess[objId] = -DELAY;
		}
	}

	function cache_Reinitialize() {
		for (let objId of Object.keys(cacheLastAccess)) {
			cacheLastAccess[objId] = -DELAY;
			cache_GetObject(objId);
		}
	}

// }}}

// ввод нового значения {{{

	(async () => {
		while (true) {
			const newvalue = await input("Введите новое значение: ");

			if (newvalue == "error") {
				// Реинициализируется кэш через 30 секунд
				setTimeout(() => { console.log("Кэш реинициализирован"); cache_Reinitialize(); }, 30*1000);
				console.log("Реинициализация через 30 сек");
			} else if (newvalue.substr(0, newvalue.indexOf(" ")) == "get") {
				const spl = newvalue.split(" ");
				const objectId = spl[1];
				const propertyId = spl[2];
				console.log(`'${propertyId}' объекта #${objectId}: ${cache_GetObjectProperty(objectId, propertyId)}`);
			} else {
				// при вводе значения кэш обновляется
				console.log("Кэш обновлён");
				cache_Clear();
			}
		}
	})();

// }}}
