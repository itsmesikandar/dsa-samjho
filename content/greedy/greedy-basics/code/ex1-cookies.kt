// Sabse kam bhookh wale bachche ko sabse chhoti chalne wali cookie - badi cookies baad ke liye bachao
fun findContentChildren(g: IntArray, s: IntArray): Int {
    g.sort() // bhookh: kam se zyada
    s.sort() // cookie size: chhoti se badi //@sort
    var child = 0
    var cookie = 0
    while (child < g.size && cookie < s.size) {
        if (s[cookie] >= g[child]) child++ // cookie kaafi hai - de do, agla bachcha //@give
        cookie++ // ye cookie ya to de di, ya kisi ke kaam ki nahi (sabse kam bhookh wala bhi nahi maana) //@next
    }
    return child //@done
}

fun main() {
    println(findContentChildren(intArrayOf(3, 1, 5, 2), intArrayOf(2, 4, 1, 3)))
    println(findContentChildren(intArrayOf(5), intArrayOf(1, 2)))
    println(findContentChildren(intArrayOf(1, 2), intArrayOf(3)))
}

// Output:
// 3
// 0
// 1
