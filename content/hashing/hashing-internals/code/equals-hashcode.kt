class PointBad(val x: Int, val y: Int) // equals() / hashCode() override NAHI kiye
data class Point(val x: Int, val y: Int) // data class: dono apne aap ban jaate hain

fun main() {
    val bad = HashMap<PointBad, String>()
    bad[PointBad(1, 2)] = "ghar"
    println(bad[PointBad(1, 2)]) // naya object -> alag hashCode -> nahi mila!

    val good = HashMap<Point, String>()
    good[Point(1, 2)] = "ghar"
    println(good[Point(1, 2)]) // same x, y -> same hashCode aur equals true

    println(Point(1, 2).hashCode() == Point(1, 2).hashCode())
}

// Output:
// null
// ghar
// true
