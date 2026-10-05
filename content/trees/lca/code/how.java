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

    // Har call batata hai: "is subtree mein p / q / unka LCA mila?"
    static TreeNode lca(TreeNode node, int p, int q) {
        if (node == null || node.val == p || node.val == q) return node; // khud p ya q - upar bhejo //@base
        TreeNode l = lca(node.left, p, q); //@left
        TreeNode r = lca(node.right, p, q);
        if (l != null && r != null) return node; // dono taraf mile - raaste yahin milte hain //@both
        return l != null ? l : r; // ek taraf se jo aaya wahi upar //@one
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
        System.out.println(lca(root, 6, 4).val);
        System.out.println(lca(root, 5, 4).val);
    }
}

// Output:
// 5
// 5
