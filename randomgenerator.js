const express = require('express');
const app = express();
const port = 3000;
const connection = require('./database');
const _ = require('underscore');

app.use(express.json());


app.get('/random-name', async(req, res) => {
    try {

        let sql = 'SELECT id, name FROM randomname WHERE is_present = ? ORDER BY RAND() LIMIT 1'
        let value = [0]
        let [rows] = await connection.query(sql, value);

        if (_.isEmpty(rows)) {
            // If all names have been selected, reset the is_present values
            await connection.execute('UPDATE randomname SET is_present = 0 ');


            let sql = 'SELECT id, name FROM randomname WHERE is_present = ? ORDER BY RAND() LIMIT 1'
            let value = [0]
            let [rows] = await connection.query(sql, value);
            const id = rows[0].id;
            const name = rows[0].name;

            // Update the is_present value for the selected name
            await connection.execute('UPDATE randomname SET is_present = 1 WHERE id = ?', [id]);


            res.json({ name: name });
            return;

        }

        console.log("id: " + rows[0].id + "   " + "name: " + rows[0].name);
        const id = rows[0].id;
        const name = rows[0].name;

        // Update the is_present value for the selected name
        await connection.execute('UPDATE randomname SET is_present = 1 WHERE id = ?', [id]);


        res.json({ name: name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error selecting random name.' });
    }
});


app.listen(port, () => {
    console.log(`Random name API listening at http://localhost:${port}`);
});