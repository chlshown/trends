const googleTrends = require('google-trends-api')

const {addRecord, addThird, getKey, connection} = require('./db.js')
// config
const lenIndex = 4 //  一次调用长度
const startMonth = 0 // 起始月份 30天
const endMonth = 12 // 结束月份 12个月
const baseLineKeyword1 = 'Purple'
const baseLineKeyword2 = 'Blue'
const fromTableName = 'Thai_JapMovies'
const toTableName = 'Thai_JapMovies'
// const tableName = 'KoreanMovies'

const getTrendsByKeyword1 = async (keyword, dataIndex, startTime, endTime, monthIdex) => {
  try {
    const startTimeFormat = `${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`
    const endTimeFormat = `${endTime.getFullYear()}-${endTime.getMonth() + 1}-${endTime.getDate()}`
    const yearData = await Promise.all([googleTrends.interestOverTime({ keyword: [baseLineKeyword1, ...keyword], startTime, endTime, geo: 'VN' })])
    // console.log(yearData)
    const result = JSON.parse(yearData[0]).default.averages

    for (let i = 1; i < keyword.length + 1; i++) {
      const temp = result[i] - 0
      const baseValue = result[0] - 0
      if (temp > 1) {
        addRecord(toTableName,keyword[i - 1], dataIndex, temp, 'success', baseLineKeyword1, baseValue, startTimeFormat, endTimeFormat)
      } else if (baseValue <= 1) {
        addRecord(toTableName, keyword[i - 1], dataIndex, temp, 're', baseLineKeyword1, baseValue, startTimeFormat, endTimeFormat)
        repeatData.push(keyword[i - 1])
      } else {
        let ifBaseMax = true
        for (let j = 1; j < lenIndex + 1; j++) {
          if (result[0] - 0 < result[j] - 0) {
            ifBaseMax = false
          }
        }
        if (!ifBaseMax && temp <= 1) {
          addRecord(toTableName, keyword[i - 1], dataIndex, temp, 'small', baseLineKeyword1, baseValue, startTimeFormat, endTimeFormat)
          // repeatData.push(keyword[i - 1])
        } else if (ifBaseMax && temp <= 1) {
          addRecord(toTableName, keyword[i - 1], dataIndex, temp, 'small', baseLineKeyword1, baseValue, startTimeFormat, endTimeFormat)
        } else {
          addRecord(toTableName, keyword[i - 1], dataIndex, temp, 'unknown', baseLineKeyword1, baseValue, startTimeFormat, endTimeFormat)
          repeatData.push(keyword[i - 1])
        }
      }
    }

    return true
  } catch (error) {
    console.error('Oh no there was an error', error)
    return false
  }
}

const getTrendsByKeyword2 = async (keyword, dataIndex, startTime, endTime, monthIdex) => {
  try {
    const startTimeFormat = `${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`
    const endTimeFormat = `${endTime.getFullYear()}-${endTime.getMonth() + 1}-${endTime.getDate()}`
    const yearData = await Promise.all([googleTrends.interestOverTime({ keyword: [baseLineKeyword2, ...keyword], startTime, endTime, geo: 'VN' })])
    // console.log(yearData)
    const result = JSON.parse(yearData[0]).default.averages

    for (let i = 1; i < keyword.length + 1; i++) {
      const temp = result[i] - 0
      const baseValue = result[0] - 0
      if (baseValue > 1 && temp > 1) {
        addThird(keyword[i - 1], dataIndex, temp, 'success', baseLineKeyword2, baseValue, startTimeFormat, endTimeFormat)
      } else if (baseValue <= 1 && temp === 100) {
        addThird(keyword[i - 1], dataIndex, temp, 'big', baseLineKeyword2, baseValue, startTimeFormat, endTimeFormat)
      } else if (baseValue <= 1) {
        addThird(keyword[i - 1], dataIndex, temp, 're', baseLineKeyword2, baseValue, startTimeFormat, endTimeFormat)
      } else {
        let ifBaseMax = true
        for (let j = 1; j < lenIndex + 1; j++) {
          if (result[0] - 0 < result[j] - 0) {
            ifBaseMax = false
          }
        }
        if (!ifBaseMax && temp <= 1) {
          addThird(keyword[i - 1], dataIndex, temp, 're', baseLineKeyword2, baseValue, startTimeFormat, endTimeFormat)
        } else if (ifBaseMax && temp <= 1) {
          addThird(keyword[i - 1], dataIndex, temp, 'small', baseLineKeyword2, baseValue, startTimeFormat, endTimeFormat)
        } else {
          addThird(keyword[i - 1], dataIndex, temp, 'unknown', baseLineKeyword2, baseValue, startTimeFormat, endTimeFormat)
        }
      }
    }

    return true
  } catch (error) {
    console.error('Oh no there was an error', error)
    return false
  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getMonthData1 = async (keywrodArr, startTime, endTime, monthIndex) => {
  try {
    let waitingTime = 1000
    let failTime = 0

    for (let i = 0; i < keywrodArr.length;) {
      console.log(`开始调用${monthIndex + 1}-${i}-A keyword ${keywrodArr[i]}`)
      const keyArr = []
      for (let j = i; j < i + lenIndex && j < keywrodArr.length; j++) {
        keyArr.push(keywrodArr[j])
      }

      // 第一次删选
      const success = await getTrendsByKeyword1(
        keyArr,
        i, startTime, endTime, monthIndex)
      if (success) {
        console.log(`调用成功${monthIndex + 1}-${i}-A`)
        await sleep(1000)
        waitingTime = 1000
        i += lenIndex
        failTime = 0
      } else {
        failTime++
        console.log(`调用失败${monthIndex + 1}-${i}-A，重新尝试${failTime}`)
        waitingTime *= 2
        if (waitingTime > 60 * 1000 * 10) {
          console.log(`当前数据调用失败${monthIndex + 1}-${i}-A，放弃尝试,总运行时间${getCostTime(mainStart)}分钟`)
          return
        }
        await sleep(waitingTime)
      }
    }
    // const testFile = path.join(__dirname, './test.csv')
    // wb.write(testFile)
  } catch (error) {
    console.error(error)
  }
}

const getMonthData2 = async (keywrodArr, startTime, endTime, monthIndex) => {
  try {
    let waitingTime = 1000
    let failTime = 0

    for (let i = 0; i < keywrodArr.length;) {
      console.log(`开始调用${monthIndex + 1}-${i}-B keyword ${keywrodArr[i]}`)
      const keyArr = []
      for (let j = i; j < i + lenIndex && j < keywrodArr.length; j++) {
        keyArr.push(keywrodArr[j])
      }
      // 第二次删选
      const success = await getTrendsByKeyword1(
        keyArr,
        i, startTime, endTime, monthIndex)
      if (success) {
        console.log(`调用成功${monthIndex + 1}-${i}-B`)
        await sleep(1000)
        waitingTime = 1000
        i += lenIndex
        failTime = 0
      } else {
        failTime++
        console.log(`调用失败${monthIndex + 1}-${i}-B，重新尝试${failTime}`)
        waitingTime *= 2
        if (waitingTime > 60 * 1000 * 10 * 120) {
          console.log(`当前数据调用失败${monthIndex + 1}-${i}-B，放弃尝试,总运行时间${getCostTime(mainStart)}分钟`)
          return
        }
        await sleep(waitingTime)
      }
    }
    // const testFile = path.join(__dirname, './test.csv')
    // wb.write(testFile)
  } catch (error) {
    console.error(error)
  }
}

const getCostTime = (start) => {
  return Math.floor((new Date() - start) / 1000 / 60)
}

const main = async () => {
  console.log('开始运行程序')
  //  await sleep(1000 * 60 * 60 * 4)
  connection.connect()
  const keywrodArr = await getKey(fromTableName)
  console.log(`开始运行程序，待查询数据:${keywrodArr.length}条`)

  for (let i = startMonth; i < endMonth; i++) {
    repeatData = []
    const monthStartTime = new Date()
    const startTime = new Date(Date.now() - ((i + 1) * 30 * 24 * 60 * 60 * 1000))
    const endTime = new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000))
    console.log(`开始第${i + 1}个月数据第一次删选`)
    await getMonthData1(keywrodArr, startTime, endTime, i)
    console.log(`开始第${i + 1}个月数据第二次删选，总数据量${repeatData.length}`)
    await getMonthData2(repeatData, startTime, endTime, i)
    console.log(`第${i + 1}个月数据运行完毕 运行时间${getCostTime(monthStartTime)}分钟`)
  }
  console.log(`全部运行完毕 运行时间${getCostTime(mainStart)}分钟`)
  connection.end()
}

const mainStart = new Date()
let repeatData = []

main()
