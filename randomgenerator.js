const express = require('express');
const app = express();
const port = 3000;
const connection = require('./database');
const _ = require('underscore');

app.use(express.json());

app.post('/insertrandomname', async(req, res) => {
    let names = req.body.array;
    let insertedNames = [];

    // let insertedNames = [];
    for (let i = 0; i < names.length; i++) {

        let checkSql = `SELECT name FROM randomname WHERE name = ?`;
        let checkValues = [names[i]];
        await connection.query(checkSql, checkValues).then(async([result]) => {

            if (_.size(result) > 0) {
                console.log(`'${names[i]}' already exists in database.`);
            } else {
                let insertSql = `INSERT INTO randomname (name,is_present) VALUES (?,?)`;
                let insertValues = [names[i], 0];
                await connection.query(insertSql, insertValues);
                insertedNames.push(names[i]);
                console.log(`Inserted '${names[i]}' into database.`);
            }
        });
    }
    res.status(200).json({ message: 'Names inserted into database', insertedNames });
});

app.get('/random-name', async(req, res) => {
    try {

        let sql = 'SELECT id, name FROM randomname WHERE is_present = ?'
            // 'SELECT id, name FROM randomname WHERE is_present = ? ORDER BY RAND() LIMIT 1'
        let value = [0]
        let [rows] = await connection.query(sql, value);
        //  console.log("outside#e@ " + _.size(rows));
        if (_.size(rows) == 1) {
            const name = rows[0].name;
            console.log("id: " + rows[0].id + "   " + "name: " + rows[0].name);
            res.json({ name: name });
            await connection.execute('UPDATE randomname SET is_present = 0 ');
        } else {
            console.log("id: " + rows[0].id + "   " + "name: " + rows[0].name);
            const id = rows[0].id;
            const name = rows[0].name;
            // Update the is_present value for the selected name
            await connection.execute('UPDATE randomname SET is_present = 1 WHERE id = ?', [id]);
            res.json({ name: name });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error selecting random name.' });
    }
});


app.listen(port, () => {
    console.log(`Random name API listening at http://localhost:${port}`);
});