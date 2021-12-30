var knex = require('knex')({
    client: 'Mysql_curso',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'root',
      database : 'apiusers'
    }
  });

module.exports = knex