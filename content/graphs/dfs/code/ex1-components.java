import java.util.ArrayList;
import java.util.List;

class Main {
    // Har naya (unvisited) node = naya component. Ek DFS us poore component ko visited kar deta hai
    static void fill(int u, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) if (!visited[v]) fill(v, adj, visited);
    }

    static int countComponents(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        boolean[] visited = new boolean[n];
        int count = 0;
        for (int s = 0; s < n; s++) {
            if (visited[s]) continue; // kisi pichhle DFS ne pehle hi chhua - purana component //@skip
            count++; // koi DFS yahan nahi pahuncha - naya component //@new
            fill(s, adj, visited); // poora component ek baar mein //@fill
        }
        return count; //@done
    }

    public static void main(String[] args) {
        System.out.println(countComponents(7, new int[][] {{0, 1}, {1, 2}, {0, 2}, {3, 4}, {5, 3}}));
        System.out.println(countComponents(5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}}));
        System.out.println(countComponents(3, new int[][] {}));
    }
}

// Output:
// 3
// 1
// 3
