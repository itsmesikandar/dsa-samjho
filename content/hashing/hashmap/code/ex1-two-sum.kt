// 2 index jinke numbers ka sum = target. Har number ke liye: uska "pair" pehle dekha hai?
fun twoSum(nums: IntArray, target: Int): IntArray {
    val seen = HashMap<Int, Int>() // value -> index //@init
    for (i in nums.indices) {
        val need = target - nums[i] // pair ke liye kya chahiye? //@need
        val j = seen[need]
        if (j != null) return intArrayOf(j, i) // pehle dekha hua mil gaya! //@found
        seen[nums[i]] = i // apne aap ko yaad rakho - aage koi pair dhoondhega //@store
    }
    return intArrayOf(-1, -1) //@none
}

fun main() {
    println(twoSum(intArrayOf(2, 7, 11, 15), 9).contentToString())
    println(twoSum(intArrayOf(3, 2, 4), 6).contentToString())
    println(twoSum(intArrayOf(3, 3), 6).contentToString()) // same value 2 baar
}

// Output:
// [0, 1]
// [1, 2]
// [0, 1]
