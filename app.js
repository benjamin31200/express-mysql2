const con = require("./db-config");
const express = require("express");
const app = express();
app.use(express.json());

const port = process.env.PORT ?? 3000;

con.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected to database with threadId :  " + con.threadId);
  }
});

app.get("/api/movies", (req, res) => {
  let sql = "SELECT * FROM movies";
  let sqlValues = [];
  if (req.query.color) {
    sql += " WHERE color = ?";
    sqlValues.push(req.query.color);
    if ((req.query.color, req.query.duration)) {
      sql += "  AND duration <= ?";
      sqlValues.push(req.query.duration);
    } else if (req.query.duration) {
      sql += " WHERE duration <= ?";
      sqlValues.push(req.query.duration);
    }
  }
  con.query(sql, sqlValues, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/movies/:moviesId", (req, res) => {
  const { moviesId } = req.params;
  con.query("SELECT * FROM movies WHERE id = ?", [moviesId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Movie not found");
    } else if (result.length === 0 || result[0] === undefined) {
      res.status(404).send("Movie not found");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/users", (req, res) => {
  let sql = "SELECT * FROM users";
  const sqlValues = [];
  if (req.query.language) {
    sql += " WHERE language = ?";
    sqlValues.push(req.query.language);
  }
  con.query(sql, sqlValues, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving users from database");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  con.query("SELECT * FROM users WHERE id = ? ", [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving users from database");
    } else if (result.length === 0 || result[0] === undefined) {
      res.status(404).send("user not found");
    } else {
      res.json(result[0]);
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
        const id = result.insertId;
        const createdMovie = { id, title, director, year, color, duration };
        res.status(201).json(createdMovie);
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
        const id = result.insertId;
        const createdUser = { id, firstname, lastname, email };
        res.status(201).json(createdUser);
      }
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userPropsToUpdate = req.body;
  con.query(
    "UPDATE users SET ? WHERE id = ?",
    [userPropsToUpdate, userId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else if (result.affectedRows === 0) {
        res.status(404).send(`User with id ${userId} not found.`);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

app.put("/api/movies/:moviesId", (req, res) => {
  const { moviesId } = req.params;
  const moviePropsToUpdate = req.body;
  con.query(
    "UPDATE movies SET ? WHERE id = ?",
    [moviePropsToUpdate, moviesId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else if (result.affectedRows === 0) {
        res.status(404).send(`Movie with id ${moviesId} not found.`);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  con.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting an user");
    } else {
      res.sendStatus(204);
    }
  });
});

app.delete("/api/movies/:moviesId", (req, res) => {
  const moviesId = req.params.moviesId;
  con.query("DELETE FROM movies WHERE id = ?", [moviesId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting an user");
    } else {
      res.status(204).send("Film supprimé !");
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
