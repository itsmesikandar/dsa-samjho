// 2 arrays ka common hissa - jo number dono mein jitni baar (kam se kam) aaye, utni baar
fun intersect(a: IntArray, b: IntArray): IntArray {
    a.sort() // dono sort -> ab merge ki tarah saath-saath chal sakte hain //@sort
    b.sort()
    val res = ArrayList<Int>()
    var i = 0
    var j = 0
    while (i < a.size && j < b.size) {
        when {
            a[i] < b[j] -> i++ // a[i] b mein aage kabhi nahi milega (b ab bada hi hoga) //@lt
            a[i] > b[j] -> j++ //@gt
            else -> { // barabar: dono mein hai //@eq
                res.add(a[i])
                i++
                j++
            }
        }
    }
    return res.toIntArray()
}

fun main() {
    println(intersect(intArrayOf(4, 9, 5), intArrayOf(9, 4, 9, 8, 4)).contentToString())
    println(intersect(intArrayOf(1, 2, 2, 1), intArrayOf(2, 2)).contentToString())
}

// Output:
// [4, 9]
// [2, 2]
