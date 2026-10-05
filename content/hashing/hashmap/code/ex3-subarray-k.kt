// Kitne subarrays ka sum = k? Prefix sum + HashMap
fun subarraySum(nums: IntArray, k: Int): Int {
    val count = HashMap<Int, Int>() // prefix sum -> kitni baar aaya
    count[0] = 1 // "kuch nahi liya" wala prefix - shuru se shuru hone wale subarrays ke liye //@init
    var pre = 0
    var ans = 0
    for (x in nums) {
        pre += x // ab tak ka total //@pre
        ans += count.getOrDefault(pre - k, 0) // pehle kitni baar prefix = pre - k tha? //@lookup
        count[pre] = count.getOrDefault(pre, 0) + 1 // apna prefix bhi gino //@store
    }
    return ans //@done
}

fun main() {
    println(subarraySum(intArrayOf(1, 2, 3), 3)) // [1, 2] aur [3]
    println(subarraySum(intArrayOf(1, -1, 1, -1), 0)) // negative numbers bhi
}

// Output:
// 2
// 4
