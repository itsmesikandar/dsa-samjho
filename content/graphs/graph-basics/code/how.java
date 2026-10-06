import java.util.ArrayList;
import java.util.List;

class Main {
    // Edge list se adjacency list: har node ki apni padosi-list
    static List<List<Integer>> buildAdj(int n, int[][] edges, boolean directed) {
        List<List<Integer>> adj = new ArrayList<>(); // n khaali lists - har node ke liye ek //@init
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]); // u se v tak rasta //@uv
            if (!directed) adj.get(e[1]).add(e[0]); // undirected: v se u bhi //@vu
        }
        return adj; //@done
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 2}, {1, 3}, {3, 4}, {4, 5}};
        System.out.println(buildAdj(6, edges, false));
        System.out.println(buildAdj(6, edges, true));
        List<List<Integer>> adj = buildAdj(6, edges, false);
        System.out.println("1 ke padosi: " + adj.get(1) + ", degree " + adj.get(1).size());
    }
}

// Output:
// [[1, 2], [0, 2, 3], [0, 1], [1, 4], [3, 5], [4]]
// [[1, 2], [2, 3], [], [4], [5], []]
// 1 ke padosi: [0, 2, 3], degree 3
