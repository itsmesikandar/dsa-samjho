// Har jump try karne ki zaroorat nahi: bas yaad rakho "ab tak kahan tak pahunch sakte hain"
fun canJump(nums: IntArray): Boolean {
    var reach = 0 // sabse door index jahan tak pahunch sakte hain //@init
    for (i in nums.indices) {
        if (i > reach) return false // i tak koi rasta nahi - aage ka sawaal hi nahi //@stuck
        reach = maxOf(reach, i + nums[i]) // i se aur aage? //@reach
        if (reach >= nums.size - 1) return true // aakhri index pahunch mein //@done
    }
    return true
}

fun main() {
    println(canJump(intArrayOf(3, 1, 0, 2, 0, 1)))
    println(canJump(intArrayOf(2, 1, 0, 3)))
    println(canJump(intArrayOf(0)))
}

// Output:
// true
// false
// true
