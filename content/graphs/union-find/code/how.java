import java.util.Arrays;

class Main {
    // DSU: har group ka ek leader (root). find = leader kaun? union = 2 groups jodo
    static class DSU {
        int[] parent, size;

        DSU(int n) {
            parent = new int[n];
            size = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i; // shuru mein har koi khud apna leader
                size[i] = 1;
            }
        }

        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]); // path compression: seedha leader se jod do //@find
            return parent[x];
        }

        boolean union(int a, int b) {
            int ra = find(a); //@roots
            int rb = find(b);
            if (ra == rb) return false; // pehle se ek hi group //@same
            if (size[ra] < size[rb]) { // bada group leader rahe - tree chhota (kam deep) rehta hai
                int t = ra;
                ra = rb;
                rb = t;
            }
            parent[rb] = ra; // chhote group ka leader bade ke leader ke neeche //@link
            size[ra] += size[rb];
            return true;
        }
    }

    public static void main(String[] args) {
        DSU d = new DSU(8);
        int[][] pairs = {{0, 1}, {2, 3}, {0, 2}, {4, 5}, {3, 4}, {1, 3}, {6, 7}};
        for (int[] p : pairs) d.union(p[0], p[1]);
        System.out.println(Arrays.toString(d.parent));
        int groups = 0;
        for (int i = 0; i < 8; i++) if (d.find(i) == i) groups++;
        System.out.println("groups: " + groups + ", 3 aur 5 saath? " + (d.find(3) == d.find(5)));
    }
}

// Output:
// [0, 0, 0, 0, 0, 4, 6, 6]
// groups: 2, 3 aur 5 saath? true
