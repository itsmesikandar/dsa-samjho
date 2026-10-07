class Main {
    // Continuous k numbers ka sabse bada sum. Brute force O(n*k); sliding window O(n).
    static int maxWindowSum(int[] arr, int k) {
        int window = 0;
        for (int i = 0; i < k; i++) window += arr[i]; // pehli window ka sum //@first
        int best = window;
        for (int i = k; i < arr.length; i++) {
            window += arr[i] - arr[i - k]; // naya aaya, sabse purana gaya //@slide
            best = Math.max(best, window); //@best
        }
        return best; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxWindowSum(new int[]{2, 1, 5, 1, 3, 2}, 3));
        System.out.println(maxWindowSum(new int[]{-1, -2, -3}, 2)); // sab negative: best = 0 se shuru mat karna
    }
}

// Output:
// 9
// -3
