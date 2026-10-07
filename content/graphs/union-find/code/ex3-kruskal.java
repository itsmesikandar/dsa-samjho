import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Main {
    // Kruskal: saari edges sasti se mehngi; jo 2 ALAG groups jode wahi lo. n - 1 edges = sab jude
    static int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }

    static int minCostConnectPoints(int[][] points) {
        int n = points.length;
        List<int[]> edges = new ArrayList<>(); // (cost, i, j) - har pair ek edge
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int cost = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
                edges.add(new int[] {cost, i, j});
            }
        }
        edges.sort(Comparator.comparingInt(e -> e[0])); // sasti edge pehle //@sort
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int total = 0, used = 0;
        for (int[] e : edges) {
            int ri = find(parent, e[1]), rj = find(parent, e[2]);
            if (ri == rj) continue; // pehle se jude - ye edge sirf cycle banayegi //@skip
            parent[rj] = ri;
            total += e[0]; // ye edge MST mein //@take
            used++;
            if (used == n - 1) break; // n - 1 edges = sab jud gaye //@done
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] pts = {{0, 0}, {1, 3}, {4, 1}, {6, 4}, {2, 6}};
        System.out.println(minCostConnectPoints(pts));
        System.out.println(minCostConnectPoints(new int[][] {{1, 1}, {4, 5}}));
        System.out.println(minCostConnectPoints(new int[][] {{3, 3}}));
    }
}

// Output:
// 18
// 7
// 0
