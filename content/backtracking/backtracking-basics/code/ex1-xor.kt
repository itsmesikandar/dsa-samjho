// Har subset ke saare numbers ka XOR nikaalo, phir sab subsets ke XOR jodo
fun subsetXORSum(nums: IntArray): Int {
    fun go(i: Int, x: Int): Int { // x = abhi tak chune numbers ka XOR (parameter = apne aap undo)
        if (i == nums.size) return x // ek subset poora: uska XOR //@leaf
        return go(i + 1, x xor nums[i]) + go(i + 1, x) // nums[i] lo + chhodo //@branch
    }
    return go(0, 0)
}

fun main() {
    println(subsetXORSum(intArrayOf(5, 1, 6)))
    println(subsetXORSum(intArrayOf(1, 3)))
}

// Output:
// 28
// 6
