// Do players baari-baari array ke kisi kinare se ek number uthate hain. Player 1 jeet (ya tie) sakta hai?
fun predictTheWinner(nums: IntArray): Boolean = diff(nums, 0, nums.size - 1) >= 0

// nums[l..r] bacha hai: jiski baari hai wo saamne wale se KITNA aage reh sakta hai (dono best khelein to)
fun diff(nums: IntArray, l: Int, r: Int): Int {
    if (l == r) return nums[l] // ek hi number: le lo //@base
    val pickL = nums[l] - diff(nums, l + 1, r) // left liya; baaki par saamne wala apna best diff banayega //@pickL
    val pickR = nums[r] - diff(nums, l, r - 1) // right liya //@pickR
    return maxOf(pickL, pickR) // jo zyada fayde ka //@ret
}

fun main() {
    println(predictTheWinner(intArrayOf(1, 5, 2)))
    println(predictTheWinner(intArrayOf(1, 5, 233, 7)))
}

// Output:
// false
// true
