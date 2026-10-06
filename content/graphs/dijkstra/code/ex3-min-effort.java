import java.util.Arrays;
import java.util.PriorityQueue;

class Main {
    // Rasta utna hi mushkil jitna uska SABSE BADA kadam. Dijkstra, bas "jodo" ki jagah "max lo"
    static int minimumEffortPath(int[][] heights) {
        int r = heights.length, c = heights[0].length;
        int[][] effort = new int[r][c];
        for (int[] row : effort) Arrays.fill(row, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[2], b[2])); // (row, col, effort) - kam effort pehle
        effort[0][0] = 0;
        pq.add(new int[] {0, 0, 0}); //@start
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!pq.isEmpty()) {
            int[] top = pq.poll(); //@poll
            int x = top[0], y = top[1], e = top[2];
            if (e > effort[x][y]) continue; // purani entry //@stale
            if (x == r - 1 && y == c - 1) return e; // manzil heap se nikli = pakka jawab //@found
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx < 0 || nx >= r || ny < 0 || ny >= c) continue;
                int ne = Math.max(e, Math.abs(heights[nx][ny] - heights[x][y])); // ab tak ka sabse bada kadam //@relax
                if (ne < effort[nx][ny]) {
                    effort[nx][ny] = ne; //@update
                    pq.add(new int[] {nx, ny, ne});
                }
            }
        }
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(minimumEffortPath(new int[][] {{1, 2, 8}, {4, 9, 3}, {2, 3, 4}}));
        System.out.println(minimumEffortPath(new int[][] {{5, 5, 5}, {5, 1, 5}}));
        System.out.println(minimumEffortPath(new int[][] {{7}}));
    }
}

// Output:
// 3
// 0
// 0
