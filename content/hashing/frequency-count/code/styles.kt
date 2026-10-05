fun main() {
    val s = "mississippi"

    // 1) IntArray(26) - sirf lowercase letters ke liye, sabse tez
    val arr = IntArray(26)
    for (c in s) arr[c - 'a']++
    println(arr['s' - 'a'])

    // 2) HashMap - kuch bhi count kar sakte ho (words, numbers, objects)
    val map = HashMap<Char, Int>()
    for (c in s) map[c] = map.getOrDefault(c, 0) + 1
    println(map.toSortedMap())

    // 3) Kotlin one-liner (andar wahi map)
    println(s.groupingBy { it }.eachCount().toSortedMap())
}

// Output:
// 4
// {i=4, m=1, p=2, s=4}
// {i=4, m=1, p=2, s=4}
