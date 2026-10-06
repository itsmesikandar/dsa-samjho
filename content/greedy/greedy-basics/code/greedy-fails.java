import java.util.Arrays;

class Main {
    // Greedy galat kab? Ek ulta example (counterexample) kaafi hai. Coin change: greedy vs DP
    static int greedyCoins(int[] coins, int amount) {
        int[] c = coins.clone();
        Arrays.sort(c);
        int left = amount, count = 0;
        for (int i = c.length - 1; i >= 0; i--) { // hamesha sabse bada sikka jo fit ho
            count += left / c[i];
            left %= c[i];
        }
        return left == 0 ? count : -1;
    }

    static int bestCoins(int[] coins, int amount) { // DP: har amount ka sabse kam sikke (DP chapter mein detail)
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a && dp[a - c] != Integer.MAX_VALUE) dp[a] = Math.min(dp[a], dp[a - c] + 1);
            }
        }
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        int[] inr = {1, 2, 5, 10};
        System.out.println("[1, 2, 5, 10], 18: greedy " + greedyCoins(inr, 18) + ", best " + bestCoins(inr, 18));
        int[] odd = {1, 3, 4};
        System.out.println("[1, 3, 4], 6: greedy " + greedyCoins(odd, 6) + ", best " + bestCoins(odd, 6));
    }
}

// Output:
// [1, 2, 5, 10], 18: greedy 4, best 4
// [1, 3, 4], 6: greedy 3, best 2
