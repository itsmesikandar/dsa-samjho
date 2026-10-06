class Main {
    // Ek sawaal, chaar tareeke: recursion -> memo -> tabulation -> do variables
    static long calls = 0;

    static long fibPlain(int n) { // 1. seedhi recursion: O(2^n)
        calls++;
        return n <= 1 ? n : fibPlain(n - 1) + fibPlain(n - 2);
    }

    static long fibMemo(int n, long[] memo) { // 2. memo (top-down): O(n)
        if (n <= 1) return n;
        if (memo[n] == 0) memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
        return memo[n];
    }

    static long fibTab(int n) { // 3. tabulation (bottom-up): chhote se bade, O(n) time, O(n) memory
        if (n <= 1) return n;
        long[] dp = new long[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]; // pichhle do pehle se bhare hain //@fill
        return dp[n];
    }

    static long fibTwo(int n) { // 4. sirf pichhle do chahiye - poora array kyun? O(1) memory
        long a = 0; // fib(i)
        long b = 1; // fib(i + 1)
        for (int k = 0; k < n; k++) {
            long c = a + b;
            a = b; // khidki ek aage khiski //@slide
            b = c;
        }
        return a; //@done
    }

    public static void main(String[] args) {
        int n = 10;
        System.out.println("tab: " + fibTab(n) + ", two vars: " + fibTwo(n));
        System.out.println("plain: " + fibPlain(n) + ", memo: " + fibMemo(n, new long[n + 1]) + ", plain calls: " + calls);
    }
}

// Output:
// tab: 55, two vars: 55
// plain: 55, memo: 55, plain calls: 177
