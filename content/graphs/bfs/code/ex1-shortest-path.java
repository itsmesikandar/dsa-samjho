import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class Main {
    // Unweighted graph mein s se t ka sabse chhota rasta: BFS + parent array
    static List<Integer> shortestPath(int n, int[][] edges, int s, int t) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        int[] dist = new int[n]; // -1 = abhi tak nahi pahunche (visited ka kaam bhi yahi)
        int[] parent = new int[n]; // kis node se pehli baar yahan aaye
        Arrays.fill(dist, -1);
        Arrays.fill(parent, -1);
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        dist[s] = 0;
        queue.offer(s); //@start
        while (!queue.isEmpty()) {
            int u = queue.poll(); //@pop
            if (u == t) break; // t nikal gaya - iski dist pakki, aage dhoondhna bekaar //@found
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1; // ek step aur //@relax
                    parent[v] = u;
                    queue.offer(v);
                }
            }
        }
        List<Integer> path = new ArrayList<>();
        if (dist[t] == -1) return path; // t tak koi rasta nahi //@none
        for (int x = t; x != -1; x = parent[x]) path.add(x); // t se parent pakad ke s tak ulta chalo //@walk
        Collections.reverse(path);
        return path;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {2, 4}, {3, 5}, {4, 6}, {5, 6}};
        System.out.println(shortestPath(7, edges, 0, 6));
        System.out.println(shortestPath(7, edges, 1, 4));
        System.out.println(shortestPath(4, new int[][] {{0, 1}, {2, 3}}, 0, 3));
    }
}

// Output:
// [0, 2, 4, 6]
// [1, 0, 2, 4]
// []
