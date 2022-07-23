const con = require('./db-config');
const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT ?? 3000;

con.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected to database with threadId :  ' + con.threadId);
  }
});

  con.promise().query('SELECT * FROM movies')
 .then(([rows,fields]) => {
  app.get('/api/movies', (req, res) => {
    if (res) {
      res.status(200).json(rows);
    }
  })
 }).catch((err) => {
     console.warn('error in the request');
 });

  app.post('/api/movies', (req, res) => {
    const { title, director, year, color, duration } = req.body;
    con.query(
      'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
      [title, director, year, color, duration],
      (err, result) => {
        if (err) {
          res.status(500).send('Error saving the movie');
        } else {
          res.status(200).send('Movie successfully saved');
        }
      }
    );
  });

  con.promise().query('SELECT * FROM users')
  .then(([rows,fields]) => {
   app.get('/api/users', (req, res) => {
     if (res) {
       res.status(200).json(rows);
     }
   })
  }).catch((err) => {
      console.warn('error in the request');
  });

  app.post('/api/users', (req, res) => {
    const { firstname, lastname, email } = req.body;
    con.query(
      'INSERT INTO users(firstname, lastname, email) VALUES (?, ?, ?)',
      [firstname, lastname, email],
      (err, result) => {
        if (err) {
          res.status(500).send('Error saving the user');
        } else {
          res.status(200).send('User successfully saved');
        }
      }
    );
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});