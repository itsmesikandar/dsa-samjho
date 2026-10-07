// Kele ke pile (piles), h ghante. Speed k = ek ghante mein ek pile se k kele.
// Sabse kam k jisse h ghante mein sab khatam ho jaayein.
fun minEatingSpeed(piles: IntArray, h: Int): Int {
    var lo = 1
    var hi = piles.max() // isse tez khaane ka fayda nahi: har pile 1 ghante mein //@init
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2 //@mid
        if (hoursNeeded(piles, mid) <= h) hi = mid // mid chal gaya: shayad aur dheere bhi chale //@ok
        else lo = mid + 1 // time zyada laga: tez khaana padega //@notok
    }
    return lo //@done
}

fun hoursNeeded(piles: IntArray, k: Int): Long {
    var hrs = 0L
    for (p in piles) hrs += (p - 1) / k + 1 // ceil(p / k) bina double ke, bina overflow ke
    return hrs
}

fun main() {
    println(minEatingSpeed(intArrayOf(3, 6, 7, 11), 8))
    println(minEatingSpeed(intArrayOf(30, 11, 23, 4, 20), 5))
}

// Output:
// 4
// 30
