class Main {
    // Stone do bahut saare mein - bacha hua = |dher1 - dher2|. Ek pile total/2 ke jitna paas ho utna kam
    static int lastStoneWeightII(int[] stones) {
        int total = 0;
        for (int x : stones) total += x;
        int half = total / 2;
        boolean[] dp = new boolean[half + 1]; // dp[s] = koi pile jiska jod s
        dp[0] = true;
        for (int x : stones) {
            for (int s = half; s >= x; s--) {
                if (dp[s - x]) dp[s] = true; //@mark
            }
        }
        for (int s = half; s >= 0; s--) {
            if (dp[s]) return total - 2 * s; // ek pile s, doosra total - s; farak total - 2s //@best
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(lastStoneWeightII(new int[] {6, 3, 8, 2}));
        System.out.println(lastStoneWeightII(new int[] {5}));
    }
}

// Output:
// 1
// 5
