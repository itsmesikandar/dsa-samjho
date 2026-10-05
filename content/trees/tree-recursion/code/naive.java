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

    static int visits = 0;

    static int height(TreeNode node) {
        if (node == null) return 0;
        visits++;
        return 1 + Math.max(height(node.left), height(node.right));
    }

    // Seedha tareeka: har node par dono subtrees ki height phir se nikaalo
    static boolean isBalancedNaive(TreeNode node) {
        if (node == null) return true;
        if (Math.abs(height(node.left) - height(node.right)) > 1) return false;
        return isBalancedNaive(node.left) && isBalancedNaive(node.right);
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
        System.out.println(isBalancedNaive(build(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)));
        System.out.println("visits = " + visits); // 10 nodes, par 19 baar gine
    }
}

// Output:
// true
// visits = 19
