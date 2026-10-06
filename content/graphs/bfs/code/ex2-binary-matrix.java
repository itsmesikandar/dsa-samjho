import java.util.ArrayDeque;

class Main {
    // Grid = implicit graph: har khula cell (0) ek node, 8 padosi cells edges. Length = path ke cells
    static int shortestPathBinaryMatrix(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        if (grid[0][0] == 1 || grid[r - 1][c - 1] == 1) return -1; // shuru ya aakhir hi band //@blocked
        int[][] dist = new int[r][c]; // 0 = abhi nahi pahunche
        ArrayDeque<int[]> queue = new ArrayDeque<>();
        dist[0][0] = 1; // pehla cell bhi gina jaata hai
        queue.offer(new int[] {0, 0}); //@start
        while (!queue.isEmpty()) {
            int[] cur = queue.poll(); //@pop
            int x = cur[0], y = cur[1];
            if (x == r - 1 && y == c - 1) return dist[x][y]; // BFS mein pehli baar pahunche = sabse chhota //@found
            for (int dx = -1; dx <= 1; dx++) {
                for (int dy = -1; dy <= 1; dy++) { // 8 dishayein (0,0 khud ka cell - dist set hai to skip)
                    int nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] == 0 && dist[nx][ny] == 0) {
                        dist[nx][ny] = dist[x][y] + 1; //@push
                        queue.offer(new int[] {nx, ny});
                    }
                }
            }
        }
        return -1; // aakhri cell tak rasta nahi //@none
    }

    public static void main(String[] args) {
        int[][] grid = {
            {0, 1, 0, 0, 0},
            {0, 1, 0, 1, 0},
            {0, 0, 0, 1, 0},
            {1, 1, 0, 1, 0},
        };
        System.out.println(shortestPathBinaryMatrix(grid));
        System.out.println(shortestPathBinaryMatrix(new int[][] {{0, 1}, {1, 0}}));
        System.out.println(shortestPathBinaryMatrix(new int[][] {{0, 1}, {1, 1}}));
    }
}

// Output:
// 8
// 2
// -1
