import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

class Main {
    // Level by level BFS: har round ki shuruaat mein queue.size = is level ke nodes
    static List<List<Integer>> bfsLevels(List<List<Integer>> adj, int start) {
        boolean[] visited = new boolean[adj.size()];
        List<List<Integer>> levels = new ArrayList<>();
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        visited[start] = true;
        while (!queue.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            for (int k = queue.size(); k > 0; k--) { // size pehle hi le liya - beech mein daale gaye agle level ke hain
                int u = queue.poll();
                level.add(u);
                for (int v : adj.get(u)) {
                    if (!visited[v]) {
                        visited[v] = true;
                        queue.offer(v);
                    }
                }
            }
            levels.add(level);
        }
        return levels;
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
        List<List<Integer>> levels = bfsLevels(adj, 0);
        System.out.println(levels);
        System.out.println("0 se sabse door: " + levels.get(levels.size() - 1) + " (" + (levels.size() - 1) + " kadam)");
    }
}

// Output:
// [[0], [1, 2], [3, 4], [5, 6]]
// 0 se sabse door: [5, 6] (3 kadam)
