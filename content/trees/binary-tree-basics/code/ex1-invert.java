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

    // Tree ka mirror image: har node ke left aur right adla-badli
    static TreeNode invertTree(TreeNode root) {
        if (root == null) return null; //@base
        TreeNode l = invertTree(root.left); // pehle dono subtrees khud ulte ho jaayein //@recurse
        TreeNode r = invertTree(root.right);
        root.left = r; // phir apne bachche adla-badli //@swap
        root.right = l;
        return root;
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

    static List<Integer> serialize(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n == null) {
                out.add(null);
                continue;
            }
            out.add(n.val);
            q.add(n.left);
            q.add(n.right);
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    public static void main(String[] args) {
        System.out.println(serialize(invertTree(build(4, 2, 7, 1, 3, 6, 9))));
        System.out.println(serialize(invertTree(build(2, 1, 3))));
    }
}

// Output:
// [4, 7, 2, 9, 6, 3, 1]
// [2, 3, 1]
