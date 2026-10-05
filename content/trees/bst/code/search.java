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

    // Binary search jaisa: har node par ek taraf hi jao
    static TreeNode search(TreeNode root, int key) {
        TreeNode cur = root;
        while (cur != null && cur.val != key)
            cur = key < cur.val ? cur.left : cur.right;
        return cur;
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
        TreeNode root = build(8, 3, 10, 1, 6, null, 14, null, null, 4, 7);
        System.out.println(search(root, 6) != null);
        System.out.println(search(root, 5) != null);
    }
}

// Output:
// true
// false
