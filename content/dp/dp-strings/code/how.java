class Main {
    // LCS: do strings ka sabse lamba common subsequence (order same, beech mein gap allowed)
    static int lcs(String a, String b) {
        int m = a.length();
        int n = b.length();
        int[][] dp = new int[m + 1][n + 1]; // dp[i][j] = a ke pehle i aur b ke pehle j chars ka LCS; row/col 0 = khaali string
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1; // dono aakhri chars same - LCS mein le lo //@match
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // a ka aakhri chhodo ya b ka - jo behtar //@skip
                }
            }
        }
        return dp[m][n]; //@done
    }

    public static void main(String[] args) {
        System.out.println(lcs("khana", "kahani"));
        System.out.println(lcs("abc", "xyz"));
    }
}

// Output:
// 4
// 0
