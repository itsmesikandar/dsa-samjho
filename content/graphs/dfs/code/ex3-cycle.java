import java.util.ArrayList;
import java.util.List;

class Main {
    // Undirected cycle: DFS mein koi visited padosi mila jo parent NAHI hai - matlab doosre raste se pahunch gaye
    static boolean hasCycleFrom(int u, int parent, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true; //@enter
        for (int v : adj.get(u)) {
            if (v == parent) continue; // jis edge se aaye usi se wapas jaana cycle nahi //@parent
            if (visited[v]) return true; // pehle dekha node, doosre raste se mila - cycle! //@cycle
            if (hasCycleFrom(v, u, adj, visited)) return true; //@go
        }
        return false; //@back
    }

    static boolean hasCycle(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        boolean[] visited = new boolean[n];
        for (int s = 0; s < n; s++) {
            if (!visited[s] && hasCycleFrom(s, -1, adj, visited)) return true; // har component alag check //@start
        }
        return false; //@none
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {1, 2}, {1, 3}, {3, 4}, {4, 5}, {5, 3}, {2, 6}};
        System.out.println(hasCycle(7, edges));
        System.out.println(hasCycle(5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}}));
        System.out.println(hasCycle(6, new int[][] {{0, 1}, {2, 3}, {3, 4}, {4, 2}}));
    }
}

// Output:
// true
// false
// true
