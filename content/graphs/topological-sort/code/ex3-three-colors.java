import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // 3 rang: 0 = white (anchhua), 1 = gray (abhi DFS ke raste par), 2 = black (poora ho gaya)
    static boolean dfs(int u, List<List<Integer>> adj, int[] color, List<Integer> post) { // true = cycle
        color[u] = 1; // gray: u abhi raste par hai //@gray
        for (int v : adj.get(u)) {
            if (color[v] == 1) return true; // raste wale node par wapas = back edge = cycle //@cycle
            if (color[v] == 0 && dfs(v, adj, color, post)) return true; //@go
        }
        color[u] = 2; // black: u ke baad aane wale sab ho gaye //@black
        post.add(u); // postorder: u apne saare "baad walon" ke BAAD list mein
        return false;
    }

    static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);
        int[] color = new int[numCourses];
        List<Integer> post = new ArrayList<>();
        for (int c = 0; c < numCourses; c++) {
            if (color[c] == 0 && dfs(c, adj, color, post)) return new int[0]; // cycle - koi order nahi //@start
        }
        int[] order = new int[numCourses];
        for (int i = 0; i < numCourses; i++) order[i] = post.get(numCourses - 1 - i); // ulta postorder = topological order //@done
        return order;
    }

    public static void main(String[] args) {
        int[][] pre = {{1, 0}, {2, 0}, {3, 1}, {3, 2}, {4, 3}, {4, 5}};
        System.out.println(Arrays.toString(findOrder(6, pre)));
        System.out.println(Arrays.toString(findOrder(3, new int[][] {{1, 0}, {2, 1}, {0, 2}})));
        System.out.println(Arrays.toString(findOrder(1, new int[][] {})));
    }
}

// Output:
// [5, 0, 2, 1, 3, 4]
// []
// [0]
