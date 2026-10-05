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

    // Level order list -> tree. Queue mein woh nodes jinke bachche abhi lagne hain.
    static TreeNode build(Integer... xs) {
        if (xs.length == 0 || xs[0] == null) return null;
        TreeNode root = new TreeNode(xs[0]);
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < xs.length) {
            TreeNode p = q.poll(); // agla parent
            if (xs[i] != null) q.add(p.left = new TreeNode(xs[i])); // null = khaali jagah
            i++;
            if (i < xs.length && xs[i] != null) q.add(p.right = new TreeNode(xs[i]));
            i++;
        }
        return root;
    }

    // Tree -> level order list (wapas), aakhir ke null hata ke. (LinkedList null rakh sakta hai, ArrayDeque nahi)
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

    static int count(TreeNode root) {
        return root == null ? 0 : 1 + count(root.left) + count(root.right);
    }

    public static void main(String[] args) {
        TreeNode t = build(3, 9, 20, null, null, 15, 7);
        System.out.println(serialize(t));
        System.out.println(count(t));
    }
}

// Output:
// [3, 9, 20, null, null, 15, 7]
// 5
