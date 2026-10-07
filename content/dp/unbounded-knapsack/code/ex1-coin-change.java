import java.util.Arrays;

class Main {
    // Kam se kam coins jinse amount bane. Har coin kitni bhi baar (unbounded). Greedy (bada pehle) galat ho sakta
    static int coinChange(int[] coins, int amount) {
        int inf = amount + 1; // itne coins kabhi nahi lagenge - 'infinity' ki jagah, +1 par overflow bhi nahi
        int[] dp = new int[amount + 1]; // dp[a] = amount a ke kam se kam coins
        Arrays.fill(dp, inf);
        dp[0] = 0; // kuch nahi dena - 0 coins
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1); // aakhri coin c: baaki a - c ka best + 1 //@try
            }
        }
        return dp[amount] > amount ? -1 : dp[amount]; //@done
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[] {1, 3, 4}, 6));
        System.out.println(coinChange(new int[] {2}, 3));
        System.out.println(coinChange(new int[] {5}, 0));
    }
}

// Output:
// 2
// -1
// 0
