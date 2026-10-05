import java.util.*;

class Main {
    public static void main(String[] args) {
        int rows = 3, cols = 4;
        // 3 rows, har row mein 4 columns. Har cell mein uska "flat index" r * cols + c
        int[][] grid = new int[rows][cols];
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++) grid[r][c] = r * cols + c;
        System.out.println(Arrays.deepToString(grid));
        System.out.println(grid[1][2]); // row 1, column 2

        // 4 padosi (upar, neeche, left, right) - direction arrays se
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int r = 0, c = 0;
        List<Integer> nbrs = new ArrayList<>();
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) nbrs.add(grid[nr][nc]); // grid ke bahar? to chhodo
        }
        System.out.println(nbrs); // corner (0,0) ke sirf 2 valid padosi
    }
}

// Output:
// [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]
// 6
// [4, 1]
