// Image (colors ki grid). (sr, sc) se shuru: usi color ke saare jude (upar/neeche/baayein/daayein) cells naye color se bharo.
fun floodFill(image: Array<IntArray>, sr: Int, sc: Int, color: Int): Array<IntArray> {
    val old = image[sr][sc]
    if (old == color) return image // same color: kuch nahi karna (warna infinite recursion)
    fun fill(r: Int, c: Int) {
        if (r !in image.indices || c !in image[0].indices || image[r][c] != old) return // bahar ya alag color: ruko //@stop
        image[r][c] = color // color diya - yahi 'visited' ka mark bhi hai //@paint
        fill(r + 1, c) // all 4 taraf spread karo //@spread
        fill(r - 1, c)
        fill(r, c + 1)
        fill(r, c - 1)
    }
    fill(sr, sc)
    return image
}

fun main() {
    val img = arrayOf(intArrayOf(1, 1, 1), intArrayOf(1, 1, 0), intArrayOf(1, 0, 1))
    println(floodFill(img, 1, 1, 2).contentDeepToString())
    val same = arrayOf(intArrayOf(0, 0), intArrayOf(0, 0))
    println(floodFill(same, 0, 0, 0).contentDeepToString())
}

// Output:
// [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
// [[0, 0], [0, 0]]
