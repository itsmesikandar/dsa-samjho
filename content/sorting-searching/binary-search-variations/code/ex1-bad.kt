// Versions 1..n. Kisi version se aage sab kharab. Pehla kharab version dhoondho (API calls kam se kam).
class VersionControl(private val firstBad: Int) {
    fun isBadVersion(v: Int): Boolean = v >= firstBad
}

fun firstBadVersion(vc: VersionControl, n: Int): Int {
    var lo = 1
    var hi = n // n kharab hai hi - answer [lo, hi] mein pakka
    while (lo < hi) {
        val mid = lo + (hi - lo) / 2 // n ~ 2^31: (lo + hi) overflow karega //@mid
        if (vc.isBadVersion(mid)) hi = mid // ye kharab: pehla kharab yahi ya isse pehle //@bad
        else lo = mid + 1 // ye theek: pehla kharab iske baad //@good
    }
    return lo //@done
}

fun main() {
    println(firstBadVersion(VersionControl(4), 5))
    println(firstBadVersion(VersionControl(1702766719), 2126753390))
}

// Output:
// 4
// 1702766719
