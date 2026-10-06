class Main {
    // Har seedha juda jodi ek union. Har SAFAL union do provinces ko ek karta hai
    static int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }

    static int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int provinces = n; // shuru mein har shehar alag province //@init
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) { // matrix symmetric - aadha hi kaafi
                if (isConnected[i][j] == 0) continue;
                int ri = find(parent, i); //@check
                int rj = find(parent, j);
                if (ri != rj) {
                    parent[rj] = ri; // do alag province jude //@merge
                    provinces--; // ek kam
                }
            }
        }
        return provinces; //@done
    }

    public static void main(String[] args) {
        int[][] m = new int[6][6];
        for (int i = 0; i < 6; i++) m[i][i] = 1;
        for (int[] e : new int[][] {{0, 1}, {1, 2}, {3, 4}}) {
            m[e[0]][e[1]] = 1;
            m[e[1]][e[0]] = 1;
        }
        System.out.println(findCircleNum(m));
        System.out.println(findCircleNum(new int[][] {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}));
        System.out.println(findCircleNum(new int[][] {{1, 1}, {1, 1}}));
    }
}

// Output:
// 3
// 3
// 1
