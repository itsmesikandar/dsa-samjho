class Main {
    // Sabse lamba palindromic subsequence. dp[i][j] = s[i..j] ke andar ka jawab. Chhote pieces se bade (length badhate jao)
    static int longestPalindromeSubseq(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        for (int i = 0; i < n; i++) dp[i][i] = 1; // ek letter khud palindrome //@one
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = dp[i + 1][j - 1] + 2; // dono edge same - andar wale ke dono taraf laga do (len 2 par andar 0) //@match
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]); // ek edge chhodo //@skip
                }
            }
        }
        return dp[0][n - 1]; //@done
    }

    public static void main(String[] args) {
        System.out.println(longestPalindromeSubseq("tamatar"));
        System.out.println(longestPalindromeSubseq("abcd"));
    }
}

// Output:
// 5
// 1
