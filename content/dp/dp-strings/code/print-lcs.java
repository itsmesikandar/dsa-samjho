class Main {
    // LCS ki length hi nahi, string bhi: pehle table bharo, phir (m, n) se peeche chalo
    static String lcsString(String a, String b) {
        int m = a.length();
        int n = b.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        StringBuilder sb = new StringBuilder();
        int i = m;
        int j = n;
        while (i > 0 && j > 0) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) { // match - ye char LCS ka hai, tirchha jao
                sb.append(a.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--; // jawab upar se aaya tha
            } else {
                j--; // baayein se aaya tha
            }
        }
        return sb.reverse().toString(); // peeche se banaya - ulta karo
    }

    public static void main(String[] args) {
        System.out.println(lcsString("khana", "kahani"));
        System.out.println(lcsString("pakoda", "pakora"));
    }
}

// Output:
// khan
// pakoa
