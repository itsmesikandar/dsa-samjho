class Main {
    // Ek din kharido, baad ke kisi din becho. Max profit? (fayda na ho to 0)
    static int maxProfit(int[] prices) {
        int minPrice = prices[0]; // ab tak ka sabse sasta din //@init
        int best = 0;
        for (int i = 1; i < prices.length; i++) {
            best = Math.max(best, prices[i] - minPrice); // aaj becho to kitna fayda? //@sell
            minPrice = Math.min(minPrice, prices[i]); // aaj sasta hai? yaad rakho //@min
        }
        return best; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7, 1, 5, 3, 6, 4}));
        System.out.println(maxProfit(new int[]{7, 6, 4, 3, 1})); // daam girte hi rahe - na kharido
    }
}

// Output:
// 5
// 0
