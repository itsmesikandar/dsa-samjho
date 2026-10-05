// Saare UNIQUE triplets jinka sum 0 ho
fun threeSum(nums: IntArray): List<List<Int>> {
    val a = nums.sorted() // sort -> two pointers chal sakte hain, aur duplicates padosi ban jaate hain //@sort
    val res = ArrayList<List<Int>>()
    for (i in a.indices) {
        if (i > 0 && a[i] == a[i - 1]) continue // same pehla number dobara -> wahi triplets milenge, skip //@skipI
        var l = i + 1
        var r = a.size - 1
        while (l < r) {
            val s = a[i] + a[l] + a[r] //@sum
            when {
                s < 0 -> l++ // chhota: badi value chahiye
                s > 0 -> r-- // bada: chhoti value chahiye
                else -> {
                    res.add(listOf(a[i], a[l], a[r])) //@found
                    l++
                    r--
                    while (l < r && a[l] == a[l - 1]) l++ // same second number skip -> duplicate triplet nahi //@dedupe
                }
            }
        }
    }
    return res
}

fun main() {
    println(threeSum(intArrayOf(-1, 0, 1, 2, -1, -4)))
    println(threeSum(intArrayOf(0, 0, 0, 0)))
}

// Output:
// [[-1, -1, 2], [-1, 0, 1]]
// [[0, 0, 0]]
