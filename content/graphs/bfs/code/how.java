import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

class Main {
    // BFS: queue se level by level - pehle saare 1 kadam door, phir 2 kadam door...
    static List<Integer> bfs(List<List<Integer>> adj, int start) {
        boolean[] visited = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        visited[start] = true; //@start
        while (!queue.isEmpty()) {
            int u = queue.poll(); // sabse pehle aaya, sabse pehle nikla (FIFO) //@pop
            order.add(u);
            for (int v : adj.get(u)) {
                if (!visited[v]) { // pehli baar dikha? //@check
                    visited[v] = true; // queue mein DAALTE hi mark - warna do baar aa sakta //@mark
                    queue.offer(v);
                }
            }
        }
        return order; //@done
    }

    public static void main(String[] args) {
        int n = 7;
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {2, 4}, {3, 5}, {4, 6}, {5, 6}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        System.out.println(bfs(adj, 0));
        System.out.println(bfs(adj, 6));
    }
}

// Output:
// [0, 1, 2, 3, 4, 5, 6]
// [6, 4, 5, 2, 3, 0, 1]
