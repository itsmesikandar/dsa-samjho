class Main {
    // Sudoku solve karo (0 = khaali). Generic: n = 4 (2x2 boxes) ya 9 (3x3 boxes).
    static boolean solveSudoku(int[][] b) {
        int n = b.length;
        int box = 1;
        while (box * box < n) box++; // 4 -> 2, 9 -> 3
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (b[r][c] != 0) continue;
                for (int d = 1; d <= n; d++) {
                    if (canPlace(b, r, c, d, box)) { // row, column, box mein d pehle se nahi //@check
                        b[r][c] = d; //@place
                        if (solveSudoku(b)) return true; // aage sab ho gaya
                        b[r][c] = 0; // aage raasta band hua: ye digit galat tha, wapas //@undo
                    }
                }
                return false; // is khaali cell mein koi digit nahi chala: PICHHLA decision galat tha //@dead
            }
        }
        return true; // koi khaali cell nahi bacha: solved //@solved
    }

    static boolean canPlace(int[][] b, int r, int c, int d, int box) {
        for (int i = 0; i < b.length; i++) if (b[r][i] == d || b[i][c] == d) return false; // row ya column mein
        int br = r / box * box, bc = c / box * box;
        for (int i = br; i < br + box; i++)
            for (int j = bc; j < bc + box; j++)
                if (b[i][j] == d) return false; // apne box mein
        return true;
    }

    static String row(int[] r) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < r.length; i++) sb.append(i == 0 ? "" : " ").append(r[i]);
        return sb.toString();
    }

    public static void main(String[] args) {
        int[][] small = {
            {1, 0, 3, 0},
            {0, 4, 0, 2},
            {2, 0, 4, 0},
            {0, 3, 0, 1},
        };
        solveSudoku(small);
        for (int[] r : small) System.out.println(row(r));
        int[][] big = {
            {5, 3, 0, 0, 7, 0, 0, 0, 0},
            {6, 0, 0, 1, 9, 5, 0, 0, 0},
            {0, 9, 8, 0, 0, 0, 0, 6, 0},
            {8, 0, 0, 0, 6, 0, 0, 0, 3},
            {4, 0, 0, 8, 0, 3, 0, 0, 1},
            {7, 0, 0, 0, 2, 0, 0, 0, 6},
            {0, 6, 0, 0, 0, 0, 2, 8, 0},
            {0, 0, 0, 4, 1, 9, 0, 0, 5},
            {0, 0, 0, 0, 8, 0, 0, 7, 9},
        };
        solveSudoku(big);
        System.out.println(row(big[0]));
        System.out.println(row(big[8]));
    }
}

// Output:
// 1 2 3 4
// 3 4 1 2
// 2 1 4 3
// 4 3 2 1
// 5 3 4 6 7 8 9 1 2
// 3 4 5 2 8 6 1 7 9
