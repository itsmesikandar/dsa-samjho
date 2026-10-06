import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // 0 se n-1 tak kitne alag SABSE SASTE raste? Dijkstra + ways[] (barabar sasta = ways jodo)
    static int countPaths(int n, int[][] roads) {
        long mod = 1_000_000_007L;
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] r : roads) {
            adj.get(r[0]).add(new int[] {r[1], r[2]});
            adj.get(r[1]).add(new int[] {r[0], r[2]});
        }
        long[] dist = new long[n]; // bade weights - long
        Arrays.fill(dist, Long.MAX_VALUE);
        long[] ways = new long[n];
        PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[1], b[1]));
        dist[0] = 0;
        ways[0] = 1;
        pq.add(new long[] {0, 0});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            int u = (int) top[0];
            long d = top[1];
            if (d > dist[u]) continue;
            for (int[] e : adj.get(u)) {
                int v = e[0];
                long nd = d + e[1];
                if (nd < dist[v]) { // naya, aur sasta rasta - purane ways bekaar
                    dist[v] = nd;
                    ways[v] = ways[u];
                    pq.add(new long[] {v, nd});
                } else if (nd == dist[v]) { // utna hi sasta doosra rasta - ways jodo
                    ways[v] = (ways[v] + ways[u]) % mod;
                }
            }
        }
        return (int) ways[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(countPaths(4, new int[][] {{0, 1, 1}, {0, 2, 1}, {1, 3, 1}, {2, 3, 1}}));
        int[][] roads = {{0, 1, 2}, {0, 2, 1}, {2, 1, 1}, {1, 4, 3}, {2, 3, 2}, {3, 4, 2}};
        System.out.println(countPaths(5, roads));
    }
}

// Output:
// 2
// 3
