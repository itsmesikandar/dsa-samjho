import java.util.ArrayList;
import java.util.List;

class Main {
    // DFS: ek neighbor pakdo aur uski poori depth tak jao; raasta band ho to wapas aao (backtrack)
    static void dfs(int u, List<List<Integer>> adj, boolean[] visited, List<Integer> order) {
        visited[u] = true; // aate hi mark //@enter
        order.add(u);
        for (int v : adj.get(u)) {
            if (!visited[v]) dfs(v, adj, visited, order); // naya neighbor - pehle uski poori depth //@go
        }
    } // saare neighbor dekh liye - wapas caller ke paas (backtrack) //@back

    public static void main(String[] args) {
        int n = 7;
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {2, 4}, {3, 5}, {4, 6}, {5, 6}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        for (int start : new int[] {0, 6}) {
            List<Integer> order = new ArrayList<>();
            dfs(start, adj, new boolean[n], order);
            System.out.println(order);
        }
    }
}

// Output:
// [0, 1, 3, 2, 4, 6, 5]
// [6, 4, 2, 0, 1, 3, 5]
