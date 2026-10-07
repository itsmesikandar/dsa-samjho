class Main {
    // 2D prefix sum: kisi bhi rectangle ka sum O(1) mein
    static class Matrix2DSum {
        // ek extra row aur column (index 0) jisme sab 0 - edge cases ki chinta khatam
        private final long[][] pre;

        Matrix2DSum(int[][] g) {
            pre = new long[g.length + 1][g[0].length + 1]; //@alloc
            for (int r = 0; r < g.length; r++) {
                for (int c = 0; c < g[0].length; c++) {
                    // apna cell + upar wala total + left wala total - dono mein gina hua kona
                    pre[r + 1][c + 1] = g[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c]; //@build
                }
            }
        }

        // (r1, c1) se (r2, c2) tak ka rectangle (dono kone include)
        long sum(int r1, int c1, int r2, int c2) {
            return pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1]; //@query
        }
    }

    public static void main(String[] args) {
        Matrix2DSum m = new Matrix2DSum(new int[][]{
            {3, 0, 1, 4},
            {5, 6, 3, 2},
            {1, 2, 0, 1},
        });
        System.out.println(m.sum(1, 1, 2, 2)); // 6 + 3 + 2 + 0
        System.out.println(m.sum(0, 0, 2, 3)); // poora grid
    }
}

// Output:
// 11
// 28
