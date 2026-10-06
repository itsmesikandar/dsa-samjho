// Kul petrol >= kul kharcha ho to jawab hai. Start dhoondhna: jahan tank minus hua, uske AAGE se dobara
fun canCompleteCircuit(gas: IntArray, cost: IntArray): Int {
    var total = 0 // poore chakkar ka hisaab
    var tank = 0 // abhi ke start se ab tak
    var start = 0
    for (i in gas.indices) {
        val diff = gas[i] - cost[i]
        total += diff
        tank += diff //@fill
        if (tank < 0) { // start se i+1 tak nahi pahunche - start..i mein se koi bhi start nahi ho sakta //@reset
            start = i + 1
            tank = 0
        }
    }
    return if (total >= 0) start else -1 // kul petrol kam - koi start nahi chalega //@done
}

fun main() {
    println(canCompleteCircuit(intArrayOf(3, 1, 2, 5, 4), intArrayOf(4, 2, 3, 1, 3)))
    println(canCompleteCircuit(intArrayOf(2, 3, 4), intArrayOf(3, 4, 3)))
}

// Output:
// 3
// -1
