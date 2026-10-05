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

    static int best = Integer.MIN_VALUE;

    // Return = is node se neeche ek taraf ka sabse accha sum (gain)
    static int gain(TreeNode node) {
        if (node == null) return 0;
        int l = Math.max(0, gain(node.left)); // negative gain se nuksaan - mat jodo
        int r = Math.max(0, gain(node.right));
        best = Math.max(best, node.val + l + r); // raasta jo yahan mudta hai //@best
        return node.val + Math.max(l, r); // parent ko sirf ek taraf //@ret
    }

    static int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
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
        System.out.println(maxPathSum(build(-10, 9, 20, null, null, 15, 7)));
        System.out.println(maxPathSum(build(-3)));
    }
}

// Output:
// 42
// -3
