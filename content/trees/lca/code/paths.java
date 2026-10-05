import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;

        TreeNode(int val) {
            this.val = val;
        }
    }

    // Root se x tak ka raasta path mein bharo; mila to true
    static boolean pathTo(TreeNode node, int x, List<Integer> path) {
        if (node == null) return false;
        path.add(node.val);
        if (node.val == x || pathTo(node.left, x, path) || pathTo(node.right, x, path)) return true;
        path.remove(path.size() - 1); // is taraf nahi mila - wapas (backtrack)
        return false;
    }

    // Dono raaste nikaalo; jahan tak same, uska aakhri = LCA
    static int lcaByPaths(TreeNode root, int p, int q) {
        List<Integer> a = new ArrayList<>();
        List<Integer> b = new ArrayList<>();
        pathTo(root, p, a);
        pathTo(root, q, b);
        int k = 0;
        while (k < a.size() && k < b.size() && a.get(k).equals(b.get(k))) k++;
        return a.get(k - 1);
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
        System.out.println(lcaByPaths(root, 7, 6));
        System.out.println(lcaByPaths(root, 7, 8));
    }
}

// Output:
// 5
// 3
