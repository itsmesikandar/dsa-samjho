// Kam baar aane wale numbers pehle; frequency barabar ho to bada number pehle
fun frequencySort(nums: IntArray): IntArray {
    val freq = HashMap<Int, Int>()
    for (x in nums) freq[x] = (freq[x] ?: 0) + 1 //@count
    // pehli key: frequency (chhoti pehle), doosri key: value (badi pehle)
    return nums.sortedWith(compareBy<Int> { freq[it] }.thenByDescending { it }).toIntArray() //@sort
}

fun main() {
    println(frequencySort(intArrayOf(2, 3, 1, 3, 2)).contentToString())
    println(frequencySort(intArrayOf(1, 1, 2, 2, 2, 3)).contentToString())
}

// Output:
// [1, 3, 3, 2, 2]
// [3, 1, 1, 2, 2, 2]
