class Main {
    // Kitne combinations (order matter nahi: 1+2 aur 2+1 ek hi) se amount bane. Har sikka kitni bhi baar
    static int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1]; // dp[a] = kitne combinations se amount a
        dp[0] = 1; // kuch na do - ek tareeka
        for (int c : coins) { // SIKKE BAHAR - har combination sikkon ke ek fixed order mein banta, ek hi baar gina //@coin
            for (int a = c; a <= amount; a++) { // seedha - c kitni bhi baar
                dp[a] += dp[a - c]; // a - c wale har combination mein ek aur c //@add
            }
        }
        return dp[amount]; //@done
    }

    public static void main(String[] args) {
        System.out.println(change(4, new int[] {1, 2, 3}));
        System.out.println(change(3, new int[] {2}));
    }
}

// Output:
// 4
// 0
