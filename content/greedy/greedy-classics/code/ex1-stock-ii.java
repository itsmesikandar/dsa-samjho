class Main {
    // Jitni baar chaho khareedo-becho: har chadhaai (aaj > kal) ka munafa jodo
    static int maxProfit2(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) { //@day
            if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1]; // kal khareeda, aaj becha //@up
        }
        return profit; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxProfit2(new int[] {7, 2, 5, 1, 6, 4}));
        System.out.println(maxProfit2(new int[] {1, 2, 3, 4, 5}));
        System.out.println(maxProfit2(new int[] {9, 7, 4}));
    }
}

// Output:
// 8
// 4
// 0
