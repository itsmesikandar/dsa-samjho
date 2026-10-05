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

    static TreeNode lca(TreeNode node, int p, int q) {
        if (node == null || node.val == p || node.val == q) return node;
        TreeNode l = lca(node.left, p, q);
        TreeNode r = lca(node.right, p, q);
        if (l != null && r != null) return node;
        return l != null ? l : r;
    }

    // node se x kitne edges neeche hai (nahi mila to -1)
    static int depth(TreeNode node, int x, int d) {
        if (node == null) return -1;
        if (node.val == x) return d; //@found
        int l = depth(node.left, x, d + 1); // bachchon mein ek kadam aur //@down
        return l != -1 ? l : depth(node.right, x, d + 1);
    }

    // p se q: upar LCA tak, phir neeche q tak
    static int distance(TreeNode root, int p, int q) {
        TreeNode a = lca(root, p, q); // raasta yahin mudta hai //@lca
        return depth(a, p, 0) + depth(a, q, 0); //@sum
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
        TreeNode root = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4);
        System.out.println(distance(root, 7, 0));
        System.out.println(distance(root, 6, 4));
    }
}

// Output:
// 5
// 3
