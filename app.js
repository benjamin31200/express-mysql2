const con = require('./db-config');
const express = require('express');
const app = express();

const port = process.env.PORT ?? 3000;

con.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected to database with threadId :  ' + con.threadId);
  }
});

con.promise().query('SELECT * FROM movies')
  .then( ([rows,fields]) => {
    app.get('/api/movies', (req, res) => {
      if (res) {
        res.status(200).json(rows);
      }
    });
  })
  .catch(console.log)
  .then( () => con.end());



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});