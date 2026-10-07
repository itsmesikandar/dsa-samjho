// Har seedha juda pair ek union. Har SUCCESSFUL union do provinces ko ek karta hai
fun find(parent: IntArray, x: Int): Int {
    if (parent[x] != x) parent[x] = find(parent, parent[x])
    return parent[x]
}

fun findCircleNum(isConnected: Array<IntArray>): Int {
    val n = isConnected.size
    val parent = IntArray(n) { it }
    var provinces = n // shuru mein har city alag province //@init
    for (i in 0 until n) {
        for (j in i + 1 until n) { // matrix symmetric - aadha hi kaafi
            if (isConnected[i][j] == 0) continue
            val ri = find(parent, i) //@check
            val rj = find(parent, j)
            if (ri != rj) {
                parent[rj] = ri // 2 alag province jude //@merge
                provinces-- // ek kam
            }
        }
    }
    return provinces //@done
}

fun main() {
    val m = Array(6) { IntArray(6) }
    for (i in 0 until 6) m[i][i] = 1
    for ((a, b) in arrayOf(intArrayOf(0, 1), intArrayOf(1, 2), intArrayOf(3, 4))) {
        m[a][b] = 1
        m[b][a] = 1
    }
    println(findCircleNum(m))
    println(findCircleNum(arrayOf(intArrayOf(1, 0, 0), intArrayOf(0, 1, 0), intArrayOf(0, 0, 1))))
    println(findCircleNum(arrayOf(intArrayOf(1, 1), intArrayOf(1, 1))))
}

// Output:
// 3
// 3
// 1
