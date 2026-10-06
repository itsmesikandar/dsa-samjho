class Main {
    // dp[i] = pehle i digits ko letters mein todne ke tareeke. Aakhri letter 1 digit ka ya 2 digit ka
    static int numDecodings(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1; // khaali string: 1 tareeka //@base
        for (int i = 1; i <= n; i++) {
            if (s.charAt(i - 1) != '0') dp[i] += dp[i - 1]; // aakhri ek digit (1-9) akela letter //@one
            if (i >= 2) {
                int two = (s.charAt(i - 2) - '0') * 10 + (s.charAt(i - 1) - '0');
                if (two >= 10 && two <= 26) dp[i] += dp[i - 2]; // aakhri do digit (10-26) ek letter //@two
            }
        }
        return dp[n]; //@done
    }

    public static void main(String[] args) {
        System.out.println(numDecodings("12102"));
        System.out.println(numDecodings("06"));
        System.out.println(numDecodings("2611"));
    }
}

// Output:
// 2
// 0
// 4
