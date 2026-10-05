import java.util.Arrays;

class Main {
    // Har row ka sum aur har column ka sum - ek hi traversal mein
    static int[][] rowAndColSums(int[][] g) {
        int rows = g.length;
        int cols = g[0].length;
        int[] rowSum = new int[rows]; //@init
        int[] colSum = new int[cols];
        for (int r = 0; r < rows; r++) { // har row
            for (int c = 0; c < cols; c++) { // us row ka har cell
                rowSum[r] += g[r][c]; // row r ka total //@add
                colSum[c] += g[r][c]; // column c ka total
            }
        }
        return new int[][]{rowSum, colSum}; //@done
    }

    public static void main(String[] args) {
        int[][] g = {
            {1, 2, 3},
            {4, 5, 6},
        };
        int[][] res = rowAndColSums(g);
        System.out.println(Arrays.toString(res[0]));
        System.out.println(Arrays.toString(res[1]));
    }
}

// Output:
// [6, 15]
// [5, 7, 9]
