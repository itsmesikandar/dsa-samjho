import java.util.Arrays;

class Main {
    // n x n matrix ko 90 degree clockwise ghumao - usi matrix mein (in-place)
    static void rotate(int[][] m) {
        int n = m.length;
        // Step 1: transpose - diagonal ke upar wale cell ko neeche wale se swap
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t; //@transpose
            }
        }
        // Step 2: har row ko ulta karo
        for (int[] row : m) {
            int l = 0, r = n - 1;
            while (l < r) {
                int t = row[l]; row[l] = row[r]; row[r] = t; //@reverse
                l++;
                r--;
            }
        }
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        rotate(m);
        System.out.println(Arrays.deepToString(m));
    }
}

// Output:
// [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
