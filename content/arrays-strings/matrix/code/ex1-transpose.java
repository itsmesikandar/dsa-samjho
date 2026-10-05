import java.util.Arrays;

class Main {
    // Transpose: rows columns ban jaati hain. g[r][c] -> t[c][r]
    static int[][] transpose(int[][] g) {
        int rows = g.length, cols = g[0].length;
        int[][] t = new int[cols][rows]; // naya grid: cols x rows //@alloc
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                t[c][r] = g[r][c]; // row/column ki jagah badal di //@copy
            }
        }
        return t; //@done
    }

    public static void main(String[] args) {
        int[][] g = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(Arrays.deepToString(transpose(g)));
    }
}

// Output:
// [[1, 4], [2, 5], [3, 6]]
