const express = require("express");
const app = express()
const port = 3000

// сетевой api {{{

	app.post('/object', (req, res) => {
		var id = req.params.id;

		if ( isNaN(id) ) {
			res.status(400).send("Invalid object ID");
		} else {
			var obj = cache_GetObject(id);

			if (obj) {
				res.status(200).json(obj);
			} else {
				res.status(404).json("Object not found");
			}
		}
	})

	app.post('/reinitialize', (req, res) => {
		cache_Reinitialize();
		res.status(200).send("Cache is reinitialzed");
	})

	app.post('/clear', (req, res) => {
		cache_Clear();
		res.status(200).send("Cache is cleared");
	})

// }}}

app.listen(port, () => {
  console.log(`Приложение открыто на порте ${port}`);
})
