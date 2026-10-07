class Main {
    // dp[i][j] = (i, j) jiska NEECHE-DAAYAN kona hai, aise sabse bade '1' square ki side
    static int maximalSquare(char[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[][] dp = new int[m + 1][n + 1]; // ek extra row/col 0 - edge ke if khatam
        int side = 0;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (matrix[i - 1][j - 1] == '1') { //@check
                    dp[i][j] = Math.min(Math.min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]) + 1; // upar, left, diagonal - sabse chhota hi badhega //@cell
                    side = Math.max(side, dp[i][j]);
                }
            }
        }
        return side * side; //@done
    }

    static char[][] of(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    public static void main(String[] args) {
        System.out.println(maximalSquare(of("0111", "1111", "1111", "0110")));
        System.out.println(maximalSquare(of("0")));
        System.out.println(maximalSquare(of("1")));
    }
}

// Output:
// 9
// 0
// 1
