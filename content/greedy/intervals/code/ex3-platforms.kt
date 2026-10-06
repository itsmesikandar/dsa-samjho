// Ek saath station par kitni trains? Aane aur jaane ke time ALAG ALAG sort karo, time ke order mein chalo
fun minPlatforms(arr: IntArray, dep: IntArray): Int {
    arr.sort()
    dep.sort() //@sort
    var i = 0
    var j = 0
    var now = 0 // abhi station par kitni trains
    var best = 0
    while (i < arr.size) {
        if (arr[i] <= dep[j]) { // agli ghatna ek train ka AANA (barabar time: pehle aayi maano - platform chahiye)
            now++ //@arrive
            i++
        } else { // pehle koi train JAAYEGI - platform khaali
            now-- //@leave
            j++
        }
        best = maxOf(best, now) //@best
    }
    return best
}

fun main() {
    println(minPlatforms(intArrayOf(9, 9, 11, 12, 15, 10), intArrayOf(10, 12, 13, 14, 16, 11)))
    println(minPlatforms(intArrayOf(9, 11, 13), intArrayOf(10, 12, 14)))
}

// Output:
// 3
// 1
