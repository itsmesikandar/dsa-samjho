// Do walls choose karo jinke beech sabse zyada paani aaye
fun maxArea(h: IntArray): Int {
    var l = 0 //@init
    var r = h.size - 1
    var best = 0
    while (l < r) {
        val area = minOf(h[l], h[r]) * (r - l) // paani = chhoti wall x distance //@area
        best = maxOf(best, area)
        if (h[l] < h[r]) {
            l++ // chhoti wall hatao - badi ko rakhne se hi aage fayda ho sakta hai //@moveL
        } else {
            r-- //@moveR
        }
    }
    return best //@done
}

fun main() {
    println(maxArea(intArrayOf(1, 8, 6, 2, 5, 4, 8, 3, 7)))
    println(maxArea(intArrayOf(1, 1)))
}

// Output:
// 49
// 1
