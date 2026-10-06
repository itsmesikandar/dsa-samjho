import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Dijkstra: jo abhi sabse paas hai (heap ka top) uski doori pakki; wahan se padosiyon ko sasta karo
    static int[] dijkstra(int n, int[][] edges, int src) {
        List<List<int[]>> adj = new ArrayList<>(); // (padosi, weight)
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(new int[] {e[1], e[2]});
            adj.get(e[1]).add(new int[] {e[0], e[2]}); // undirected sadak
        }
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1])); // (node, dist) - kam dist pehle
        dist[src] = 0;
        pq.add(new int[] {src, 0}); //@start
        while (!pq.isEmpty()) {
            int[] top = pq.poll(); //@poll
            int u = top[0], d = top[1];
            if (d > dist[u]) continue; // purani entry - u ka isse sasta dist pehle hi mil chuka //@stale
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                if (d + w < dist[v]) { // u se hoke v sasta padta hai? //@relax
                    dist[v] = d + w; //@update
                    pq.add(new int[] {v, dist[v]});
                }
            }
        }
        for (int i = 0; i < n; i++) if (dist[i] == Integer.MAX_VALUE) dist[i] = -1; // -1 = pahunch nahi //@done
        return dist;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 4}, {0, 2, 1}, {2, 1, 2}, {1, 3, 5}, {2, 3, 8}, {3, 4, 3}, {2, 4, 12}, {4, 5, 1}};
        System.out.println(Arrays.toString(dijkstra(6, edges, 0)));
        System.out.println(Arrays.toString(dijkstra(4, new int[][] {{0, 1, 3}, {2, 3, 1}}, 0)));
    }
}

// Output:
// [0, 3, 1, 8, 11, 12]
// [0, 3, -1, -1]
