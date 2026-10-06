class Main {
    // Ek baar khareedo, ek baar becho: har din socho "aaj bechein to ab tak ke SABSE SASTE din se kitna?"
    static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE; // ab tak ka sabse sasta din //@init
        int best = 0;
        for (int p : prices) {
            if (p < minPrice) {
                minPrice = p; // aur sasta din - khareedne ke liye isse behtar koi pichhla din nahi //@min
            } else {
                best = Math.max(best, p - minPrice); // aaj bechein to munafa //@sell
            }
        }
        return best; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[] {7, 2, 5, 1, 6, 4}));
        System.out.println(maxProfit(new int[] {5, 4, 3}));
    }
}

// Output:
// 5
// 0
