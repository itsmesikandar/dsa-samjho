class Main {
    // Degree tareeka (koi bhi graph): star mein center ka degree n - 1, baaki sab ka 1
    static int findCenterByDegree(int[][] edges) {
        int n = edges.length + 1; // star mein n - 1 edges
        int[] deg = new int[n + 1]; // nodes 1..n, index 0 khaali
        for (int[] e : edges) {
            deg[e[0]]++; //@deg
            deg[e[1]]++;
        }
        for (int v = 1; v <= n; v++) if (deg[v] == n - 1) return v; //@pick
        return -1;
    }

    // Shortcut: center HAR edge mein hai - to pehli 2 edges ka common node hi center. O(1)
    static int findCenter(int[][] edges) {
        int a = edges[0][0], b = edges[0][1]; //@first
        int c = edges[1][0], d = edges[1][1]; //@second
        return (a == c || a == d) ? a : b; // a dono mein - wahi center; warna b //@common
    }

    public static void main(String[] args) {
        int[][] edges = {{1, 2}, {2, 3}, {4, 2}};
        System.out.println(findCenter(edges));
        System.out.println(findCenterByDegree(edges));
        System.out.println(findCenter(new int[][] {{5, 1}, {1, 3}, {4, 1}, {1, 2}}));
    }
}

// Output:
// 2
// 2
// 1
