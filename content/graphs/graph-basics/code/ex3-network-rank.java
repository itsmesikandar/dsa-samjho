class Main {
    // Pair (a, b) ka rank = a ki roads + b ki roads; a-b seedhi road ho to wo ek hi baar count karo
    static int maximalNetworkRank(int n, int[][] roads) {
        int[] deg = new int[n];
        boolean[][] connected = new boolean[n][n]; // adjacency matrix: "a-b road hai?" O(1) mein //@init
        for (int[] r : roads) {
            deg[r[0]]++; //@deg
            deg[r[1]]++;
            connected[r[0]][r[1]] = true;
            connected[r[1]][r[0]] = true;
        }
        int best = 0;
        for (int a = 0; a < n; a++) {
            for (int b = a + 1; b < n; b++) {
                int rank = deg[a] + deg[b]; // dono ki roads jodo //@pair
                if (connected[a][b]) rank--; // a-b wali road dono degree mein count ki gayi - ek ghatao //@minus
                best = Math.max(best, rank);
            }
        }
        return best; //@done
    }

    public static void main(String[] args) {
        int[][] roads = {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 4}, {3, 5}};
        System.out.println(maximalNetworkRank(6, roads));
        System.out.println(maximalNetworkRank(4, new int[][] {{0, 1}, {0, 3}, {1, 2}, {1, 3}}));
        System.out.println(maximalNetworkRank(3, new int[][] {}));
    }
}

// Output:
// 5
// 4
// 0
