class Main {
    // Do barabar jod wale hisse? = kya koi subset ka jod total / 2 hai? (0/1 knapsack, value ki jagah true/false)
    static boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 != 0) return false; // odd jod - do barabar hisse ho hi nahi sakte //@odd
        int target = total / 2;
        boolean[] dp = new boolean[target + 1]; // dp[s] = ab tak ke items se jod s ban sakta hai?
        dp[0] = true; // kuch na lo - jod 0
        for (int x : nums) {
            for (int s = target; s >= x; s--) { // ULTA - taaki ye item isi round mein dobara na jud jaaye //@loop
                if (dp[s - x]) dp[s] = true; // s - x pehle ban chuka tha, ab x jodo //@mark
            }
        }
        return dp[target]; //@done
    }

    public static void main(String[] args) {
        System.out.println(canPartition(new int[] {3, 1, 5, 9, 2}));
        System.out.println(canPartition(new int[] {2, 3, 4}));
        System.out.println(canPartition(new int[] {1, 2, 5}));
    }
}

// Output:
// true
// false
// false
