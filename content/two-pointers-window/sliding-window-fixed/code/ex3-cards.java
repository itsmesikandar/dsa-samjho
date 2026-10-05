class Main {
    // Har baar line ke shuru ya end se ek card uthao, total k cards. Zyada se zyada points?
    static int maxScore(int[] cards, int k) {
        int n = cards.length;
        int total = 0;
        for (int c : cards) total += c;
        int w = n - k; // jo cards BACHENGE, wo hamesha beech ka lagatar hissa hain
        int sum = 0;
        for (int i = 0; i < w; i++) sum += cards[i]; // pehla 'bacha hua' hissa //@first
        int minSum = sum;
        for (int r = w; r < n; r++) {
            sum += cards[r] - cards[r - w]; // size w ki window aage khiski //@slide
            minSum = Math.min(minSum, sum); // bache hue ka sum jitna kam, utha hua utna zyada //@best
        }
        return total - minSum;
    }

    public static void main(String[] args) {
        System.out.println(maxScore(new int[]{1, 2, 3, 4, 5, 6, 1}, 3));
        System.out.println(maxScore(new int[]{9, 7, 7, 9, 7, 7, 9}, 7)); // saare uthaye: w = 0
    }
}

// Output:
// 12
// 55
