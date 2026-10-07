class Main {
    // Sirf neighbors ko swap karke sort karna hai. Kam se kam kitne swaps lagenge?
    // (Jawab = inversions: aise jode i < j jahan a[i] > a[j])
    static int countSwaps(int[] arr) {
        int[] a = arr.clone();
        int swaps = 0;
        for (int pass = 0; pass < a.length - 1; pass++) {
            for (int j = 0; j < a.length - 1 - pass; j++) {
                if (a[j] > a[j + 1]) { // galat order wale neighbor //@compare
                    int t = a[j]; // har aisa swap thik EK inversion khatam karta hai //@swap
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                    swaps++;
                }
            }
        }
        return swaps;
    }

    public static void main(String[] args) {
        System.out.println(countSwaps(new int[]{2, 4, 1, 3, 5}));
        System.out.println(countSwaps(new int[]{5, 4, 3, 2, 1})); // ulta array: n(n-1)/2
    }
}

// Output:
// 3
// 10
