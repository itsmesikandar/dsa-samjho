// Do index jinke numbers ka sum = target. Har number ke liye: uska "jodi" pehle dekha hai?
fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap<Int, Int>() // value -> index //@init
    for (i in nums.indices) {
        val need = target - nums[i] // jodi ke liye kya chahiye? //@need
        val j = seen[need]
        if (j != null) return intArrayOf(j, i) // pehle dekha hua mil gaya! //@found
        seen[nums[i]] = i // apne aap ko yaad rakho - aage koi jodi dhoondhega //@store
    }
    return intArrayOf(-1, -1) //@none
}

fun main() {
    println(twoSum(intArrayOf(2, 7, 11, 15), 9).contentToString())
    println(twoSum(intArrayOf(3, 2, 4), 6).contentToString())
    println(twoSum(intArrayOf(3, 3), 6).contentToString()) // same value do baar
}

// Output:
// [0, 1]
// [1, 2]
// [0, 1]
