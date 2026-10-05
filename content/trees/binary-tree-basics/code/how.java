import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;

        TreeNode(int val) {
            this.val = val;
        }
    }

    // Tree ki height (max depth): root se sabse door leaf tak kitne nodes
    static int maxDepth(TreeNode root) {
        if (root == null) return 0; // khaali tree ki height 0 //@base
        int l = maxDepth(root.left); // left subtree ki height - bharosa karo //@left
        int r = maxDepth(root.right); //@right
        return 1 + Math.max(l, r); // main khud (1) + dono mein se lamba //@combine
    }

    // LeetCode jaisa level order (null = khaali) se tree banao
    static TreeNode build(Integer... xs) {
        if (xs.length == 0 || xs[0] == null) return null;
        TreeNode root = new TreeNode(xs[0]);
        Deque<TreeNode> q = new ArrayDeque<>();
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
        System.out.println(maxDepth(build(3, 9, 20, null, null, 15, 7)));
        System.out.println(maxDepth(build(1, null, 2)));
        System.out.println(maxDepth(build()));
    }
}

// Output:
// 3
// 2
// 0
