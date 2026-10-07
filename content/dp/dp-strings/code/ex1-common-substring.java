class Main {
    // Sabse lamba common SUBSTRING (continuous, gap nahi). LCS jaisa table, par mismatch par 0 - chain toot gaya
    static int longestCommonSubstr(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1]; // dp[i][j] = a[i-1] aur b[j-1] par KHATAM hone wala common substring
        int best = 0;
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1; // pichhla common hissa ek aur lamba //@match
                    best = Math.max(best, dp[i][j]);
                } else {
                    dp[i][j] = 0; // yahan khatam hone wala koi common substring nahi //@reset
                }
            }
        }
        return best; // jawab kisi bhi cell mein ho sakta, sirf aakhri mein nahi //@done
    }

    public static void main(String[] args) {
        System.out.println(longestCommonSubstr("pakoda", "pakora"));
        System.out.println(longestCommonSubstr("abc", "xyz"));
    }
}

// Output:
// 4
// 0
