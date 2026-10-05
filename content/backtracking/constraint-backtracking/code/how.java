import java.util.ArrayList;
import java.util.List;

class Main {
    // n x n board par n queens aise rakho ki koi kisi ko na maare (row, column, diagonal). Saare boards.
    static List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        place(0, n, new int[n], new boolean[n], new boolean[2 * n], new boolean[2 * n], res);
        return res;
    }

    // cols: column mein queen? d1: (r - c + n) wala diagonal, d2: (r + c) wala diagonal
    static void place(int r, int n, int[] queenCol, boolean[] cols, boolean[] d1, boolean[] d2, List<List<String>> res) {
        if (r == n) { // har row mein ek queen: board taiyaar //@found
            List<String> board = new ArrayList<>();
            for (int c : queenCol) board.add(".".repeat(c) + "Q" + ".".repeat(n - c - 1));
            res.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue; // yahan rakhi to koi maar dega - O(1) check //@check
            queenCol[r] = c; //@place
            cols[c] = true;
            d1[r - c + n] = true;
            d2[r + c] = true;
            place(r + 1, n, queenCol, cols, d1, d2, res); // agli row
            cols[c] = false; // queen uthao: doosra column try karne ke liye //@remove
            d1[r - c + n] = false;
            d2[r + c] = false;
        }
    }

    public static void main(String[] args) {
        System.out.println(solveNQueens(4));
        System.out.println(solveNQueens(1));
        System.out.println(solveNQueens(8).size());
    }
}

// Output:
// [[.Q.., ...Q, Q..., ..Q.], [..Q., Q..., ...Q, .Q..]]
// [[Q]]
// 92
