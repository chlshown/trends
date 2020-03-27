const fun1 = () => {
    try {
        if(i > 10) return
        console.log(`before ${i}`)
        i++
        throw(1)
        console.log(`after ${i}`)
        i++
    } catch (error) {
        console.log(`catch ${i}`)
        i++
        fun1()
    }
}

let i = 1
fun1()