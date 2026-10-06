import java.util.ArrayDeque;

class Main {
    // Multi-source BFS: saare sade santre ek saath queue mein. Ek level = ek minute
    static int orangesRotting(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        int fresh = 0;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                if (grid[i][j] == 2) queue.offer(new int[] {i, j}); // har sada santra ek source //@sources
                else if (grid[i][j] == 1) fresh++;
            }
        }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int minutes = 0;
        while (!queue.isEmpty() && fresh > 0) {
            minutes++; // naya level = naya minute //@minute
            for (int k = queue.size(); k > 0; k--) { // sirf is minute ke sade santre
                int[] cur = queue.poll();
                for (int[] d : dirs) {
                    int nx = cur[0] + d[0], ny = cur[1] + d[1];
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] == 1) {
                        grid[nx][ny] = 2; // padosi sad gaya - grid hi visited ka kaam karta hai //@rot
                        fresh--;
                        queue.offer(new int[] {nx, ny});
                    }
                }
            }
        }
        return fresh == 0 ? minutes : -1; // koi taaza santra pahunch se bahar //@done
    }

    public static void main(String[] args) {
        System.out.println(orangesRotting(new int[][] {{2, 1, 0, 2}, {1, 1, 0, 1}, {0, 1, 1, 1}}));
        System.out.println(orangesRotting(new int[][] {{2, 0, 1}}));
        System.out.println(orangesRotting(new int[][] {{0, 2}}));
    }
}

// Output:
// 3
// -1
// 0
