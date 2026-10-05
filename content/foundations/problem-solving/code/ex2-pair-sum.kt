// SORTED array mein do numbers jinka sum = target. Unke index do, na mile to [-1, -1].
// Brute force O(n^2). "Sorted" ka hint use karke two pointers -> O(n).
fun pairWithSum(arr: IntArray, target: Int): IntArray {
    var l = 0 //@init
    var r = arr.size - 1
    while (l < r) {
        val s = arr[l] + arr[r] //@sum
        if (s == target) return intArrayOf(l, r) //@found
        if (s < target) l++ // sum chhota: badi value chahiye, l aage //@left
        else r-- // sum bada: chhoti value chahiye, r peeche //@right
    }
    return intArrayOf(-1, -1) //@none
}

fun main() {
    println(pairWithSum(intArrayOf(1, 3, 4, 6, 8, 11), 10).contentToString())
    println(pairWithSum(intArrayOf(1, 2, 3), 7).contentToString())
}

// Output:
// [2, 3]
// [-1, -1]
