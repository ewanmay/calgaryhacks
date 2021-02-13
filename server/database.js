const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'db.sqlite'

class Database {
  constructor() {
    this.db = new sqlite3.Database(DBSOURCE, (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
      } else {
        console.log('Connected to SQLite database.')
        this.makeUserTable()
        this.makeMatchHistoryTable()
        this.makeUserMatchHistoryTable()
      }
    })
  }

  makeUserTable() {
    this.db.run(
      `CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username text NOT NULL UNIQUE, 
        password text NOT NULL,
        isAdmin integer default 0
      )`,
      (err) => {
        if (err) {
          // Table already created
          console.log('SQLite found table: user')
        } else {
          // Table just created, creating some rows
          console.log('SQLite creating table: user')
          const insert =
            'INSERT INTO user (username, password, isAdmin) VALUES (?,?,?)'
          this.db.run(insert, ['admin', 'admin123456', 1])
          this.db.run(insert, ['user', 'user123456', 0])
        }
      }
    )
  }
  /*
   *   Please note the callback may not get called immediately.
   *
   *   Returns:
   *   - row: the sql row returned with user that was found.
   *   - undefined: user was not found
   */
  getUserInfo(username, password, callback) {
    const sql = 'select * from user where username = ? and password = ?'
    const params = [username, password]

    this.db.get(sql, params, (err, row) => {
      if (err) {
        return callback(err.message)
      }

      return callback(row)
    })
  }

  /*
   *   Please note the callback may not get called immediately.
   */
  addNewUser(username, password, callback) {
    const sql = 'INSERT INTO user (username, password) VALUES (?,?)'
    const params = [username, password]
    this.db.run(sql, params, function (err, result) {
      if (err) {
        return callback(err.message)
      }
      return callback({ id: this.lastID })
    })
  }

}

module.exports = Database
