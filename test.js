
const googleTrends = require('google-trends-api')

const word = 'Ngự Thiên Thần Đế 2: Tu La Lục Thần'
const startTime = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))
const endTime = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))

const getTrendsByKeyword1 = async () => {
    try {
      const yearData = await Promise.all([googleTrends.interestOverTime({ keyword: ['Purple', word, 'Cuộc Chiến Mỹ Nhân', 'gự Thiên Thần Đế 3: Chi U Yến Kinh Hồn', 'Tình Vương Vấn'], startTime, endTime, geo: 'VN' })])
      // console.log(yearData)
      const result = JSON.parse(yearData[0]).default.averages
      console.log(result)
    }
    catch(error) {

    }
}

// getTrendsByKeyword1()
const [a, ...b] = [1,2,3,4,5]
console.log(b)
var arg = process.argv[process.argv.length - 1]
console.log(arg)