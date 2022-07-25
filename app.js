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

app.get("/api/movies", (req, res) => {
  con.query("SELECT * FROM movies", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/users", (req, res) => {
  con.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving users from database");
    } else {
      res.json(result);
    }
  });
});

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  con.query(
    "INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving the movie");
      } else {
        res.status(200).send("Movie successfully saved");
      }
    }
  );
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  con.query(
    "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)",
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving the user");
      } else {
        res.status(200).send("User successfully saved");
      }
    }
  );
});

app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const userPropsToUpdate = req.body;
  con.query(
    'UPDATE users SET ? WHERE id = ?',
    [userPropsToUpdate, userId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a user');
      } else {
        res.status(200).send('User updated successfully 🎉');
      }
    }
  );
});

app.put('/api/movies/:moviesId', (req, res) => {
  const { moviesId } = req.params;
  const moviePropsToUpdate = req.body;
  con.query(
    'UPDATE movies SET ? WHERE id = ?',
    [moviePropsToUpdate, moviesId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a user');
      } else {
        res.status(200).send('User updated successfully 🎉');
      }
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  con.query(
    'DELETE FROM users WHERE id = ?',
    [userId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('😱 Error deleting an user');
      } else {
        res.sendStatus(204);
      }
    }
  );
});

app.delete('/api/movies/:moviesId', (req, res) => {
  const moviesId = req.params.moviesId;
  con.query(
    'DELETE FROM movies WHERE id = ?',
    [moviesId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('😱 Error deleting an user');
      } else {
        res.status(204).send('Film supprimé !');
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});