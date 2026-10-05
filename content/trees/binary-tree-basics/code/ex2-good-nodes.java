import java.util.LinkedList;
import java.util.Queue;

class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;

        TreeNode(int val) {
            this.val = val;
        }
    }

    // Node 'good' hai agar root se us tak ke raaste mein koi bhi usse BADA nahi. Kitne good nodes?
    static int goodNodes(TreeNode root) {
        return dfs(root, Integer.MIN_VALUE);
    }

    static int dfs(TreeNode node, int maxSoFar) { // upar se neeche: raaste ka max saath le chalo
        if (node == null) return 0; //@base
        int good = node.val >= maxSoFar ? 1 : 0; // raaste mein mujhse bada koi nahi? //@check
        int m = Math.max(maxSoFar, node.val); // bachchon ke liye naya max
        return good + dfs(node.left, m) + dfs(node.right, m); //@recurse
    }

    static TreeNode build(Integer... xs) {
        if (xs.length == 0 || xs[0] == null) return null;
        TreeNode root = new TreeNode(xs[0]);
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < xs.length) {
            TreeNode p = q.poll();
            if (xs[i] != null) q.add(p.left = new TreeNode(xs[i]));
            i++;
            if (i < xs.length && xs[i] != null) q.add(p.right = new TreeNode(xs[i]));
            i++;
        }
        return root;
    }

    public static void main(String[] args) {
        System.out.println(goodNodes(build(3, 1, 4, 3, null, 1, 5)));
        System.out.println(goodNodes(build(3, 3, null, 4, 2)));
    }
}

// Output:
// 4
// 3
