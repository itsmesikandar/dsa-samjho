class Main {
    // Recursive sum: koi array nahi banayi, phir bhi O(n) space! (call stack)
    static int sumRec(int[] arr, int i) {
        if (i == arr.length) return 0; // base case: aage kuch nahi //@base
        return arr[i] + sumRec(arr, i + 1); // pehle baaki ka sum, phir jodo //@call
    }

    // Loop wala version: O(1) space
    static int sumLoop(int[] arr) {
        int total = 0;
        for (int x : arr) total += x;
        return total;
    }

    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 2};
        System.out.println(sumRec(arr, 0));
        System.out.println(sumLoop(arr));
    }
}

// Output:
// 10
// 10
