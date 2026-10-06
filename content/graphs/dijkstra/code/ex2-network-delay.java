import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    // Signal sab tak kab pahunchega = sabse door wale node ki shortest doori (k se)
    static int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>(); // nodes 1..n
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[] {t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
        dist[k] = 0;
        pq.add(new int[] {k, 0}); //@start
        while (!pq.isEmpty()) {
            int[] top = pq.poll(); //@poll
            int u = top[0], d = top[1];
            if (d > dist[u]) continue;
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                if (d + w < dist[v]) {
                    dist[v] = d + w; //@relax
                    pq.add(new int[] {v, dist[v]});
                }
            }
        }
        int ans = 0;
        for (int v = 1; v <= n; v++) {
            if (dist[v] == Integer.MAX_VALUE) return -1; // koi node tak signal pahuncha hi nahi //@unreached
            ans = Math.max(ans, dist[v]); // sab tak tab pahunchega jab sabse late wale tak //@max
        }
        return ans;
    }

    public static void main(String[] args) {
        int[][] times = {{1, 2, 4}, {1, 3, 1}, {3, 2, 2}, {2, 4, 1}, {3, 5, 7}, {4, 5, 3}};
        System.out.println(networkDelayTime(times, 5, 1));
        System.out.println(networkDelayTime(times, 5, 2));
        System.out.println(networkDelayTime(new int[][] {{1, 2, 1}}, 2, 1));
    }
}

// Output:
// 7
// -1
// 1
