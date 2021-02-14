import { Game } from '../client/src/context/types';

const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = 'db.sqlite'

class Database {
  db: any
  constructor() {
    this.db = new sqlite3.Database(DBSOURCE, (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
      } else {
        console.log('Connected to SQLite database.')
        this.makeUserTable()
        this.makeSteamGameTable() 
      }
    })
  }

  makeUserTable() {
    this.db.run(
      `CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username text NOT NULL UNIQUE, 
        email text NOT NULL UNIQUE, 
        password text NOT NULL,
        steam_id text
      )`,
      (err) => {
        if (err) {
          // Table already created
          console.log('SQLite found table: user')
        } else {
          // Table just created, creating some rows
          // TODO remove when want to remove seed users
          console.log('SQLite creating table: user')
          const insert = 'INSERT INTO user (username, password, email) VALUES (?,?,?)'
          console.log('SQLite adding seed users')
          this.db.run(insert, ['ross', '123', 'ross@test.com'])
          this.db.run(insert, ['ewan', '123', 'ewan@test.com'])
          this.db.run(insert, ['dylan','123', 'dylan@test.com'])
          this.db.run(insert, ['antoine', '123', 'antoine@test.com'])
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
  getUserInfo(username, callback) {
    const sql = 'select * from user where username = ?'
    const params = [username]

    this.db.get(sql, params, (err, row) => {
      if (err) {
        console.log(err)
        return callback(err.message)
      }
      return callback(row)
    })
  }

  login(username, password, callback) {
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
  addNewUser(username, password, email, callback) {
    const sql = 'INSERT INTO user (username, password, email) VALUES (?,?,?)'
    const params = [username, password, email]
    this.db.run(sql, params, function (err, result) {
      if (err) {
        return callback(err.message)
      }
      return callback({ id: this.lastID })
    })
  }

  addSteamId(username, steamId, callback) {
    const sql = 'UPDATE user set steam_id = ? WHERE username = ?'
    const params = [steamId, username]
    this.db.run(sql, params, function (err, result) {
      if (err) {
        console.log('ERROR addSteamId', err.message)
        return callback(false)
      }
      return callback(true)
    })

  }

  makeSteamGameTable() {
    this.db.run(
      `CREATE TABLE steam_game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appid INTEGER NOT NULL UNIQUE, 
        name TEXT NOT NULL, 
        website TEXT,
        multiplayer INTEGER 
      )`,
      (err) => {
        if (err) {
          // Table already created
          console.log('SQLite found table: steam_game')
        } 
      }
    )
  }

  addSteamGame(appid, game: Game, callback){
    const sql = 'INSERT INTO steam_game (appid, name, website, multiplayer) VALUES (?,?,?,?)'
    const params = [appid, game.name, game.website, game.multiplayer]
    this.db.run(sql, params, function (err, result) {
      if (err) {
        return callback(err.message)
      }
      return callback({ id: this.lastID })
    })
  }

  getSteamGame(appid, callback){
    const sql = 'select * from steam_game where appid = ?'
    const params = [appid]

    this.db.get(sql, params, (err, row) => {
      if (err) {
        return callback(err.message, appid)
      }
      return callback(row, appid)
    })
  }

}

module.exports = Database
