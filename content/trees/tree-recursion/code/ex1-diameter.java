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

    static int best = 0;

    // Return = height; jawab (best) har node par update
    static int height(TreeNode node) {
        if (node == null) return 0;
        int l = height(node.left);
        int r = height(node.right);
        best = Math.max(best, l + r); // raasta jo is node par mudta hai: l + r edges //@best
        return 1 + Math.max(l, r); // parent ko sirf ek taraf ki height //@ret
    }

    static int diameter(TreeNode root) {
        best = 0;
        height(root);
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
        System.out.println(diameter(build(1, 2, 3, 4, 5, null, null, 6, null, null, 7, 8, null, null, 9)));
        System.out.println(diameter(build(1, 2, 3, 4, 5)));
    }
}

// Output:
// 6
// 3
