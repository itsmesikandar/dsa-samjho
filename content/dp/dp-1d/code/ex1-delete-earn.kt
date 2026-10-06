// Value v lo to saare v milte hain, par v-1 aur v+1 jal jaate hain = values par house robber!
fun deleteAndEarn(nums: IntArray): Int {
    val maxV = nums.max()
    val points = IntArray(maxV + 1)
    for (x in nums) points[x] += x // har value ka "ghar" - usme kitna paisa //@bucket
    var take = 0 // pichhli value LI to ab tak ka best
    var skip = 0 // pichhli value CHHODI to ab tak ka best
    for (v in 0..maxV) {
        val newTake = skip + points[v] // v lena hai to v-1 chhoda hona chahiye //@take
        skip = maxOf(skip, take) // v chhodo - pichhla kuch bhi chalega
        take = newTake
    }
    return maxOf(take, skip) //@done
}

fun main() {
    println(deleteAndEarn(intArrayOf(1, 1, 2, 3, 3, 5)))
    println(deleteAndEarn(intArrayOf(5)))
}

// Output:
// 13
// 5
