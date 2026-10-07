// Gol raaste par stations: i par gas[i] milta, agle station tak cost[i] lagta. Kahan se shuru karein ki
// poora chakkar ho jaaye? Na ho to -1. (Answer ho to ek hi hota hai.)
fun canCompleteCircuit(gas: IntArray, cost: IntArray): Int {
    var total = 0 // poore chakkar ka hisaab: < 0 to impossible
    var tank = 0 // abhi wale start se ab tak tank
    var start = 0
    for (i in gas.indices) {
        val diff = gas[i] - cost[i]
        total += diff
        tank += diff //@drive
        if (tank < 0) { // start..i mein se kahin se bhi shuru karo, i ke baad nahi pahunchoge: i + 1 try karo //@reset
            start = i + 1
            tank = 0
        }
    }
    return if (total >= 0) start else -1 // total theek hai to bacha hua start ghoom ke bhi pahunchega //@answer
}

fun main() {
    println(canCompleteCircuit(intArrayOf(1, 2, 3, 4, 5), intArrayOf(3, 4, 5, 1, 2)))
    println(canCompleteCircuit(intArrayOf(2, 3, 4), intArrayOf(3, 4, 3)))
}

// Output:
// 3
// -1
