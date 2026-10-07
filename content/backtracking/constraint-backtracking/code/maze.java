import java.util.ArrayList;
import java.util.List;

class Main {
    static final int[] DR = {1, 0, 0, -1}; // D, L, R, U - alphabetical order, to raaste bhi sorted milenge
    static final int[] DC = {0, -1, 1, 0};
    static final String DIR = "DLRU";

    // Rat (0,0) se (n-1,n-1) jaana chahta hai. 1 = khula, 0 = wall. Move: D, L, R, U. Saare raaste.
    static List<String> findPaths(int[][] m) {
        int n = m.length;
        List<String> res = new ArrayList<>();
        if (m[0][0] == 0 || m[n - 1][n - 1] == 0) return res;
        go(m, 0, 0, new boolean[n][n], new StringBuilder(), res);
        return res;
    }

    static void go(int[][] m, int r, int c, boolean[][] seen, StringBuilder path, List<String> res) {
        int n = m.length;
        if (r == n - 1 && c == n - 1) {
            res.add(path.toString());
            return;
        }
        seen[r][c] = true; // is raaste par yahan dobara nahi aana (warna gol-gol ghoomte rahenge)
        for (int k = 0; k < 4; k++) {
            int nr = r + DR[k], nc = c + DC[k];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && m[nr][nc] == 1 && !seen[nr][nc]) {
                path.append(DIR.charAt(k));
                go(m, nr, nc, seen, path, res);
                path.deleteCharAt(path.length() - 1);
            }
        }
        seen[r][c] = false; // wapas jaate time cell phir khula - doosre raaste isse guzar sakein
    }

    public static void main(String[] args) {
        int[][] maze = {
            {1, 0, 0, 0},
            {1, 1, 0, 1},
            {1, 1, 0, 0},
            {0, 1, 1, 1},
        };
        System.out.println(findPaths(maze));
    }
}

// Output:
// [DDRDRR, DRDDRR]
