class Main {
    // O(n) extra memory dekar har range-sum query O(1) mein
    static long[] buildPrefix(int[] arr) {
        long[] pre = new long[arr.length + 1]; // n+1 extra dabbe; pre[0] = 0 //@alloc
        for (int i = 0; i < arr.length; i++) {
            pre[i + 1] = pre[i] + arr[i]; // ab tak ka total //@fill
        }
        return pre;
    }

    // arr[l..r] ka sum = pre[r+1] - pre[l]
    static long rangeSum(long[] pre, int l, int r) {
        return pre[r + 1] - pre[l]; //@query
    }

    public static void main(String[] args) {
        long[] pre = buildPrefix(new int[]{2, 4, 1, 5, 3});
        System.out.println(rangeSum(pre, 1, 3)); // 4 + 1 + 5
        System.out.println(rangeSum(pre, 0, 4)); // poora array
    }
}

// Output:
// 10
// 15
