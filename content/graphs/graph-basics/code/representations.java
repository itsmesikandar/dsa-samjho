import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // (padosi, weight) pairs ko Kotlin Pair jaisa print karo: [(1, 5), (2, 3)]
    static String show(List<int[]> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append("(").append(list.get(i)[0]).append(", ").append(list.get(i)[1]).append(")");
        }
        return sb.append("]").toString();
    }

    // Ek hi weighted directed graph - matrix aur list dono mein
    public static void main(String[] args) {
        int n = 4;
        int[][] edges = {{0, 1, 5}, {0, 2, 3}, {2, 1, 1}, {1, 3, 2}}; // (from, to, weight)

        // 1. Adjacency matrix: mat[u][v] = weight, 0 = edge nahi. Memory n * n
        int[][] mat = new int[n][n];
        for (int[] e : edges) mat[e[0]][e[1]] = e[2];
        for (int[] row : mat) System.out.println(Arrays.toString(row));

        // 2. Adjacency list: har node ke (padosi, weight) pairs. Memory n + m
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) adj.get(e[0]).add(new int[] {e[1], e[2]});
        for (int u = 0; u < n; u++) System.out.println(u + " -> " + show(adj.get(u)));

        // 3. "u se v edge hai?" - matrix O(1), list O(degree)
        boolean back = false;
        for (int[] p : adj.get(1)) if (p[0] == 0) back = true;
        System.out.println("0->1: " + (mat[0][1] != 0) + ", 1->0: " + back);
    }
}

// Output:
// [0, 5, 3, 0]
// [0, 0, 0, 2]
// [0, 1, 0, 0]
// [0, 0, 0, 0]
// 0 -> [(1, 5), (2, 3)]
// 1 -> [(3, 2)]
// 2 -> [(1, 1)]
// 3 -> []
// 0->1: true, 1->0: false
