class Main {
    // Ek baar O(n) mein prefix banao, phir har range-sum query O(1)
    static class RangeSum {
        private final long[] pre; // pre[k] = pehle k items ka total; pre[0] = 0

        RangeSum(int[] arr) {
            pre = new long[arr.length + 1]; //@alloc
            for (int i = 0; i < arr.length; i++) pre[i + 1] = pre[i] + arr[i]; // ab tak ka total + agla item //@build
        }

        // arr[l..r] (dono include) ka sum
        long sum(int l, int r) {
            return pre[r + 1] - pre[l]; //@query
        }
    }

    public static void main(String[] args) {
        RangeSum rs = new RangeSum(new int[]{3, 1, 4, 1, 5, 9});
        System.out.println(rs.sum(1, 3)); // 1 + 4 + 1
        System.out.println(rs.sum(0, 5)); // poora array
        System.out.println(rs.sum(4, 4)); // sirf ek item
    }
}

// Output:
// 6
// 23
// 5
