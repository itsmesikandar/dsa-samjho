import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Kahn + min-heap: free nodes mein hamesha sabse chhota pehle -> sabse chhota (lexicographic) topological order
    static List<Integer> smallestTopo(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            indeg[e[1]]++;
        }
        PriorityQueue<Integer> pq = new PriorityQueue<>(); // queue ki jagah heap
        for (int v = 0; v < n; v++) if (indeg[v] == 0) pq.add(v);
        List<Integer> order = new ArrayList<>();
        while (!pq.isEmpty()) {
            int u = pq.poll();
            order.add(u);
            for (int v : adj.get(u)) if (--indeg[v] == 0) pq.add(v);
        }
        return order.size() == n ? order : new ArrayList<>();
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}, {5, 4}};
        System.out.println(smallestTopo(6, edges)); // queue wala Kahn: [0, 5, 1, 2, 3, 4]
        System.out.println(smallestTopo(3, new int[][] {{2, 0}, {1, 0}}));
    }
}

// Output:
// [0, 1, 2, 3, 5, 4]
// [1, 2, 0]
