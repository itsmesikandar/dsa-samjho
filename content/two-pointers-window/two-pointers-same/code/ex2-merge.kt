// nums1 mein m numbers + end mein n khaali jagah. nums2 (n numbers) ko andar merge karo, sorted.
fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int) {
    var i = m - 1 // nums1 ka aakhri asli number //@init
    var j = n - 1 // nums2 ka aakhri number
    var k = m + n - 1 // kahan likhna hai (peeche se)
    while (j >= 0) { // nums2 khatam = kaam khatam (nums1 ke bache pehle se sahi jagah par)
        if (i >= 0 && nums1[i] > nums2[j]) { // dono ke aakhri mein bada kaun? //@compare
            nums1[k] = nums1[i] //@takeA
            i--
        } else {
            nums1[k] = nums2[j] //@takeB
            j--
        }
        k--
    }
}

fun main() {
    val a = intArrayOf(1, 2, 3, 0, 0, 0)
    merge(a, 3, intArrayOf(2, 5, 6), 3)
    println(a.contentToString())
    val b = intArrayOf(0)
    merge(b, 0, intArrayOf(1), 1) // nums1 mein koi asli number nahi
    println(b.contentToString())
}

// Output:
// [1, 2, 2, 3, 5, 6]
// [1]
