import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Directed weighted graph: src se dst ka sabse sasta rasta - kharcha aur rasta dono
    static String cheapestPath(int n, int[][] edges, int src, int dst) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) adj.get(e[0]).add(new int[] {e[1], e[2]}); // sirf u → v
        int[] dist = new int[n];
        int[] parent = new int[n]; // kis node se sabse sasta aaya
        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
        dist[src] = 0;
        pq.add(new int[] {src, 0}); //@start
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int u = top[0], d = top[1];
            if (d > dist[u]) continue;
            if (u == dst) break; // dst heap se nikla = uski doori pakki //@found
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                if (d + w < dist[v]) {
                    dist[v] = d + w; // sasta rasta mila - parent bhi badlo //@relax
                    parent[v] = u;
                    pq.add(new int[] {v, dist[v]});
                }
            }
        }
        if (dist[dst] == Integer.MAX_VALUE) return "rasta nahi"; //@none
        List<String> path = new ArrayList<>();
        for (int x = dst; x != -1; x = parent[x]) path.add(String.valueOf(x)); // dst se parent pakad ke src tak //@walk
        Collections.reverse(path);
        return dist[dst] + ": " + String.join(" -> ", path);
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 2}, {0, 2, 6}, {1, 2, 3}, {1, 3, 8}, {2, 3, 2}, {2, 4, 7}, {3, 4, 1}, {3, 5, 6}, {4, 5, 2}};
        System.out.println(cheapestPath(6, edges, 0, 5));
        System.out.println(cheapestPath(6, edges, 2, 5));
        System.out.println(cheapestPath(6, edges, 5, 0));
    }
}

// Output:
// 10: 0 -> 1 -> 2 -> 3 -> 4 -> 5
// 5: 2 -> 3 -> 4 -> 5
// rasta nahi
