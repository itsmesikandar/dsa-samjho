import java.util.ArrayDeque;
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

    // Root se SABSE PAAS wali leaf tak kitne nodes?
    static int minDepth(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int depth = 0;
        while (!q.isEmpty()) {
            depth++; // naya level shuru //@level
            for (int k = q.size(); k > 0; k--) {
                TreeNode n = q.poll();
                if (n.left == null && n.right == null) return depth; // BFS mein pehli leaf = sabse paas wali: yahin ruko //@leaf
                if (n.left != null) q.add(n.left); //@push
                if (n.right != null) q.add(n.right);
            }
        }
        return depth;
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
        System.out.println(minDepth(build(1, 2, 3, 4, 5, null, 6, 7, null, null, null, 8)));
        System.out.println(minDepth(build(2, null, 3, null, 4, null, 5, null, 6))); // ek hi leaf, sabse neeche
    }
}

// Output:
// 3
// 5
