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

    // (is subtree ki height, sabse deep leaves ka LCA)
    record Res(int h, TreeNode node) {}

    static Res deep(TreeNode node) {
        if (node == null) return new Res(0, null);
        Res l = deep(node.left);
        Res r = deep(node.right);
        if (l.h() == r.h()) return new Res(l.h() + 1, node); // dono taraf barabar deep - yahi LCA //@tie
        return l.h() > r.h() ? new Res(l.h() + 1, l.node()) : new Res(r.h() + 1, r.node()); // deep taraf ka jawab //@deeper
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
        System.out.println(deep(build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4)).node().val);
        System.out.println(deep(build(0, 1, 3, null, 2)).node().val);
    }
}

// Output:
// 2
// 2
