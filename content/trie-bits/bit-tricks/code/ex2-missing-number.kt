// 0..n mein se ek number gayab. Saare index (0..n) aur saari values XOR - jo dono jagah hain kat jaate, gayab bachta
fun missingNumber(nums: IntArray): Int {
    var x = nums.size // index n loop mein nahi aata - pehle hi daal do
    for (i in nums.indices) {
        x = x xor i xor nums[i] // index bhi, value bhi //@xor
    }
    return x //@done
}

fun main() {
    println(missingNumber(intArrayOf(4, 0, 1, 3)))
    println(missingNumber(intArrayOf(0)))
}

// Output:
// 2
// 1
