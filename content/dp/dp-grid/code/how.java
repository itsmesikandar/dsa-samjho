class Main {
    // Upar-baayein se neeche-daayein, sirf neeche ya daayein chalo. dp[i][j] = (i, j) tak pahunchne ke raste
    static int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) dp[i][0] = 1; // pehla column: sirf neeche neeche - ek hi rasta //@edge
        for (int j = 0; j < n; j++) dp[0][j] = 1; // pehli row: sirf daayein daayein
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]; // aakhri kadam: upar se aaye ya baayein se //@cell
            }
        }
        return dp[m - 1][n - 1]; //@done
    }

    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 4));
        System.out.println(uniquePaths(1, 5));
        System.out.println(uniquePaths(10, 10));
    }
}

// Output:
// 10
// 1
// 48620
