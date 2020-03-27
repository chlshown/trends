const mysql = require('mysql')

const connection = mysql.createConnection({
  host: '172.31.20.89',
  user: 'user',
  password: '!1Qaz@2Wsx#3Edc',
  database: 'trends'
})

const addFirst = (keyword, state) => {
  const addSql = `REPLACE INTO first (keyword,state) VALUES(?,?); `
  var addSqlParams = [keyword, state]
  // 增
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('addFirst [REPLACE ERROR] - ', err.message)
    }

    // console.log('--------------------------INSERT----------------------------')
    // // console.log('INSERT ID:',result.insertId);
    // console.log('INSERT ID:', result)
    // console.log('-----------------------------------------------------------------\n\n')
  })
}

const addThird = (keyword, groupIndex, value, state, base, baseValue, start, end) => {
  const addSql = `INSERT INTO third (keyword, groupIndex, value, state, base, baseValue, start, end) VALUES(?,?,?,?,?,?,?,?); `
  var addSqlParams = [keyword, groupIndex, value, state, base, baseValue, start, end]
  // 增
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('addThird [REPLACE ERROR] - ', err.message)
    }
  })
}
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getSmallFromFirst = async () => {
  const sql = 'SELECT * FROM records WHERE  state = "small";'
  let res = []
  await connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message)
    }
    res = result
  })
  await sleep(3000)
  return res.map(item => {
    return item.keyword
  })
}

const getKey = async (tableName) => {
  const sql = `SELECT * FROM ${tableName};`
  let res = []
  await connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message)
    }
    res = result
  })
  await sleep(3000)
  return res.map(item => {
    return item.field1
  })
}

const addRecord = (tableNmae, keyword, groupIndex, value, state, base, baseValue, start, end) => {
  const addSql = `INSERT INTO ${tableNmae} (keyword, groupIndex, value, state, base, baseValue, start, end) VALUES(?,?,?,?,?,?,?,?); `
  var addSqlParams = [keyword, groupIndex, value, state, base, baseValue, start, end]
  // 增
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('addRecord [REPLACE ERROR] - ', err.message)
    }
  })
}
module.exports = {addFirst, addRecord, addThird, getSmallFromFirst, getKey, connection}
