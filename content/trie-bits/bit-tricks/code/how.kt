// Bitmask: n items ke 2^n subsets = 0 se 2^n - 1 tak ke numbers. Bit i on = nums[i] liya
fun subsets(nums: IntArray): List<List<Int>> {
    val n = nums.size
    val all = ArrayList<List<Int>>()
    for (mask in 0 until (1 shl n)) { // har mask ek subset //@mask
        val cur = ArrayList<Int>()
        for (i in 0 until n) {
            if (((mask shr i) and 1) == 1) cur.add(nums[i]) // bit i on - nums[i] lo (brackets zaroori) //@pick
        }
        all.add(cur)
    }
    return all //@done
}

fun main() {
    println(subsets(intArrayOf(1, 2, 3)))
    println(subsets(intArrayOf(9)))
}

// Output:
// [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
// [[], [9]]
