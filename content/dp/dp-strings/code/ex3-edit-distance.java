class Main {
    // a ko b banao - insert, delete, replace (har ek ka kharcha 1). Kam se kam kitne operations?
    static int minDistance(String a, String b) {
        int m = a.length();
        int n = b.length();
        int[][] dp = new int[m + 1][n + 1]; // dp[i][j] = a ke pehle i chars ko b ke pehle j chars banane ka kharcha
        for (int i = 0; i <= m; i++) dp[i][0] = i; // b khaali - sab delete //@base
        for (int j = 0; j <= n; j++) dp[0][j] = j; // a khaali - sab insert
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1]; // aakhri chars same - kuch nahi karna //@same
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1])); // delete, insert, replace //@op
                }
            }
        }
        return dp[m][n]; //@done
    }

    public static void main(String[] args) {
        System.out.println(minDistance("paneer", "pani"));
        System.out.println(minDistance("", "abc"));
    }
}

// Output:
// 3
// 3
