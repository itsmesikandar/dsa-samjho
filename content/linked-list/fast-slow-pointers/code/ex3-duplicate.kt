// n + 1 numbers, sab 1..n ke beech -> kam se kam ek repeat. Array badle bina, O(1) memory mein dhoondho.
fun findDuplicate(nums: IntArray): Int {
    // i -> nums[i] ko 'next' maano. Duplicate value par do arrows aate hain = circle ki shuruaat.
    var slow = nums[0]
    var fast = nums[0]
    do {
        slow = nums[slow] // 1 kadam //@step
        fast = nums[nums[fast]] // 2 kadam
    } while (slow != fast)
    slow = nums[0] // circle start dhoondhne wala Floyd ka doosra hissa //@restart
    while (slow != fast) {
        slow = nums[slow] //@walk
        fast = nums[fast]
    }
    return slow //@found
}

fun main() {
    println(findDuplicate(intArrayOf(1, 3, 4, 2, 2)))
    println(findDuplicate(intArrayOf(3, 1, 3, 4, 2)))
}

// Output:
// 2
// 3
