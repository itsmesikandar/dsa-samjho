class Main {
    // Letters ki grid mein word hai? Letters padosi cells (upar/neeche/baayein/daayein) se, ek cell ek hi baar.
    static boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfs(board, word, r, c, 0)) return true; // har cell se shuru karke dekho
        return false;
    }

    static boolean dfs(char[][] board, String word, int r, int c, int k) {
        if (k == word.length()) return true; // saare letters mil gaye //@found
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(k)) return false; // bahar ya letter galat //@stop
        char ch = board[r][c];
        board[r][c] = '#'; // is raaste par ye cell use ho gaya - dobara nahi //@mark
        boolean ok = dfs(board, word, r + 1, c, k + 1) || dfs(board, word, r - 1, c, k + 1)
            || dfs(board, word, r, c + 1, k + 1) || dfs(board, word, r, c - 1, k + 1);
        board[r][c] = ch; // wapas: doosre raaston ke liye phir khula //@unmark
        return ok;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'A', 'B', 'C', 'E'},
            {'S', 'F', 'C', 'S'},
            {'A', 'D', 'E', 'E'},
        };
        System.out.println(exist(board, "ABCCED"));
        System.out.println(exist(board, "SEE"));
        System.out.println(exist(board, "ABCB")); // B dobara use nahi kar sakte
    }
}

// Output:
// true
// true
// false
