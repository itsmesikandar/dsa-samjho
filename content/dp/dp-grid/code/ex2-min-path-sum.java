class Main {
    // Har cell ka kharcha. Neeche / daayein chal ke kam se kam jod. dp[i][j] = (i, j) tak ka sabse sasta rasta
    static int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int best;
                if (i == 0 && j == 0) best = 0; // shuruaat //@start
                else if (i == 0) best = dp[i][j - 1]; // pehli row: sirf baayein se
                else if (j == 0) best = dp[i - 1][j]; // pehla column: sirf upar se
                else best = Math.min(dp[i - 1][j], dp[i][j - 1]); // dono mein sasta //@cell
                dp[i][j] = grid[i][j] + best;
            }
        }
        return dp[m - 1][n - 1]; //@done
    }

    public static void main(String[] args) {
        int[][] g = {{2, 1, 4}, {3, 8, 1}, {5, 2, 6}, {1, 4, 3}};
        System.out.println(minPathSum(g));
        System.out.println(minPathSum(new int[][] {{5}}));
    }
}

// Output:
// 17
// 5
