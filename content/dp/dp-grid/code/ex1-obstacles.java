class Main {
    // Unique paths, par kuch cells mein stone (1). Stone par dp = 0 - wahan se koi rasta aage nahi jaata
    static int uniquePathsWithObstacles(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) { // stone //@rock
                    dp[i][j] = 0;
                    continue;
                }
                if (i == 0 && j == 0) { // shuruaat (stone nahi) - 1 rasta //@start
                    dp[i][j] = 1;
                    continue;
                }
                int up = i > 0 ? dp[i - 1][j] : 0; // grid ke bahar se kuch nahi aata
                int left = j > 0 ? dp[i][j - 1] : 0;
                dp[i][j] = up + left; //@cell
            }
        }
        return dp[m - 1][n - 1];
    }

    public static void main(String[] args) {
        int[][] g = {{0, 0, 0, 0}, {0, 1, 0, 0}, {0, 0, 0, 1}, {1, 0, 0, 0}};
        System.out.println(uniquePathsWithObstacles(g));
        System.out.println(uniquePathsWithObstacles(new int[][] {{1}}));
        System.out.println(uniquePathsWithObstacles(new int[][] {{0, 1}, {0, 0}}));
    }
}

// Output:
// 3
// 0
// 1
