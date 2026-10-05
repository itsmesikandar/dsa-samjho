import java.util.Arrays;

class Main {
    // Image (rangon ki grid). (sr, sc) se shuru: usi rang ke saare jude (upar/neeche/baayein/daayein) cells naye rang se bharo.
    static int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old == color) return image; // same rang: kuch nahi karna (warna infinite recursion)
        fill(image, sr, sc, old, color);
        return image;
    }

    static void fill(int[][] image, int r, int c, int old, int color) {
        if (r < 0 || r >= image.length || c < 0 || c >= image[0].length || image[r][c] != old) return; // bahar ya alag rang: ruko //@stop
        image[r][c] = color; // rang diya - yahi 'visited' ka nishaan bhi hai //@paint
        fill(image, r + 1, c, old, color); // chaaron taraf phailo //@spread
        fill(image, r - 1, c, old, color);
        fill(image, r, c + 1, old, color);
        fill(image, r, c - 1, old, color);
    }

    public static void main(String[] args) {
        int[][] img = {{1, 1, 1}, {1, 1, 0}, {1, 0, 1}};
        System.out.println(Arrays.deepToString(floodFill(img, 1, 1, 2)));
        int[][] same = {{0, 0}, {0, 0}};
        System.out.println(Arrays.deepToString(floodFill(same, 0, 0, 0)));
    }
}

// Output:
// [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
// [[0, 0], [0, 0]]
