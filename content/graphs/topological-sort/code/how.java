import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

class Main {
    // Kahn's algorithm: jiska koi intezaar nahi (in-degree 0) wahi abhi ho sakta hai
    static List<Integer> topoSort(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]); // u -> v: pehle u, phir v //@build
            indeg[e[1]]++; // v ko ek aur cheez ka intezaar
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) queue.offer(v); // koi intezaar nahi - abhi ho sakte //@ready
        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int u = queue.poll(); //@take
            order.add(u);
            for (int v : adj.get(u)) {
                indeg[v]--; // u ho gaya - v ka ek intezaar kam //@dec
                if (indeg[v] == 0) queue.offer(v); // ab v ka koi intezaar nahi //@free
            }
        }
        return order.size() == n ? order : new ArrayList<>(); // kuch nodes kabhi free nahi hue = cycle //@check
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}, {5, 4}};
        System.out.println(topoSort(6, edges));
        System.out.println(topoSort(3, new int[][] {{0, 1}, {1, 2}, {2, 0}}));
    }
}

// Output:
// [0, 5, 1, 2, 3, 4]
// []
