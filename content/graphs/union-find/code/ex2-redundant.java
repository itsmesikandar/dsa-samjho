import java.util.Arrays;

class Main {
    // Edges ek ek jodo. Jis edge ke dono sire PEHLE SE ek group mein - wahi cycle banati hai
    static int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }

    static int[] findRedundantConnection(int[][] edges) {
        int[] parent = new int[edges.length + 1]; // nodes 1..n, aur n = edges.length
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (int[] e : edges) {
            int ra = find(parent, e[0]); //@roots
            int rb = find(parent, e[1]);
            if (ra == rb) return new int[] {e[0], e[1]}; // a se b pehle hi pahunch sakte the - ye edge faltu //@cycle
            parent[rb] = ra; //@merge
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[][] edges = {{1, 2}, {1, 3}, {2, 4}, {3, 4}, {4, 5}};
        System.out.println(Arrays.toString(findRedundantConnection(edges)));
        System.out.println(Arrays.toString(findRedundantConnection(new int[][] {{1, 2}, {2, 3}, {3, 1}})));
    }
}

// Output:
// [3, 4]
// [3, 1]
