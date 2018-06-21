var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_bians',
  password        : '7534',
  database        : 'cs340_bians'
});

module.exports.pool = pool;