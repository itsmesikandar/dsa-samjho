import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

class Main {
    // Ek semester mein jitne chaho course (jinke pre ho chuke). Kahn level by level: ek level = ek semester
    static int minSemesters(int n, int[][] relations) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] r : relations) {
            adj.get(r[0]).add(r[1]);
            indeg[r[1]]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int c = 0; c < n; c++) if (indeg[c] == 0) queue.offer(c); // pehle semester ke course //@ready
        int semesters = 0, done = 0;
        while (!queue.isEmpty()) {
            semesters++; // queue mein abhi jitne hain, sab isi semester //@sem
            for (int k = queue.size(); k > 0; k--) {
                int c = queue.poll();
                done++;
                for (int nx : adj.get(c)) {
                    if (--indeg[nx] == 0) queue.offer(nx); // agle semester mein ho sakta //@free
                }
            }
        }
        return done == n ? semesters : -1; // cycle - kuch course kabhi nahi ho sakte //@check
    }

    public static void main(String[] args) {
        int[][] rel = {{0, 2}, {1, 2}, {2, 3}, {2, 4}, {3, 5}, {4, 5}};
        System.out.println(minSemesters(7, rel));
        System.out.println(minSemesters(3, new int[][] {{0, 1}, {1, 2}, {2, 1}}));
        System.out.println(minSemesters(3, new int[][] {}));
    }
}

// Output:
// 4
// -1
// 1
