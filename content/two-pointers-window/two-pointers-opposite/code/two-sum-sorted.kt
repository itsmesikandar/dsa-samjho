// Two Sum II: sorted array, answer 1-indexed. Template: dono kinaron se, sum dekh ke pointer hilao
fun twoSumSorted(numbers: IntArray, target: Int): IntArray {
    var l = 0
    var r = numbers.size - 1
    while (l < r) {
        val s = numbers[l] + numbers[r]
        when {
            s == target -> return intArrayOf(l + 1, r + 1) // question 1-indexed maangta hai
            s < target -> l++ // chhota sum: badi value chahiye
            else -> r-- // bada sum: chhoti value chahiye
        }
    }
    return intArrayOf(-1, -1)
}

fun main() {
    println(twoSumSorted(intArrayOf(2, 7, 11, 15), 9).contentToString())
    println(twoSumSorted(intArrayOf(-1, 0), -1).contentToString())
}

// Output:
// [1, 2]
// [1, 2]
