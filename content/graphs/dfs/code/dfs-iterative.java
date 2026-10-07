import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

class Main {
    // Recursion ki jagah apna stack: bahut deep graph (1 lakh nodes ki line) par StackOverflow se bachao
    static List<Integer> dfsIterative(List<List<Integer>> adj, int start) {
        boolean[] visited = new boolean[adj.size()];
        List<Integer> order = new ArrayList<>();
        ArrayDeque<Integer> stack = new ArrayDeque<>();
        stack.push(start);
        while (!stack.isEmpty()) {
            int u = stack.pop(); // LIFO - sabse naya pehle
            if (visited[u]) continue; // ek node stack mein 2 baar aa sakta hai - nikalte time check
            visited[u] = true;
            order.add(u);
            List<Integer> nb = adj.get(u);
            for (int i = nb.size() - 1; i >= 0; i--) { // ulta daalo taaki pehla neighbor sabse upar rahe
                if (!visited[nb.get(i)]) stack.push(nb.get(i));
            }
        }
        return order;
    }

    public static void main(String[] args) {
        int n = 7;
        int[][] edges = {{0, 1}, {0, 2}, {1, 3}, {2, 3}, {2, 4}, {3, 5}, {4, 6}, {5, 6}};
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        System.out.println(dfsIterative(adj, 0));
        System.out.println(dfsIterative(adj, 6));
    }
}

// Output:
// [0, 1, 3, 2, 4, 6, 5]
// [6, 4, 2, 0, 1, 3, 5]
