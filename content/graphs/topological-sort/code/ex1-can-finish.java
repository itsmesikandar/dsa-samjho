import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

class Main {
    // [course, pre] = pehle pre, phir course -> edge pre -> course. Sab course free ho paaye? (cycle nahi?)
    static boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]); // dhyaan: pre -> course, ulta nahi //@build
            indeg[p[0]]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int c = 0; c < numCourses; c++) if (indeg[c] == 0) queue.offer(c); //@ready
        int done = 0;
        while (!queue.isEmpty()) {
            int c = queue.poll();
            done++; // c padh liya //@take
            for (int next : adj.get(c)) {
                if (--indeg[next] == 0) queue.offer(next); // next ke saare pre ho gaye //@free
            }
        }
        return done == numCourses; // koi course kabhi free nahi hua = cycle mein phansa //@check
    }

    public static void main(String[] args) {
        System.out.println(canFinish(4, new int[][] {{1, 0}, {2, 0}, {3, 1}, {3, 2}}));
        System.out.println(canFinish(2, new int[][] {{0, 1}, {1, 0}}));
        System.out.println(canFinish(3, new int[][] {}));
    }
}

// Output:
// true
// false
// true
