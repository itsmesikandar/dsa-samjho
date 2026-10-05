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

    // Height bhejo, ya -1 agar neeche kahin balance toota
    static int check(TreeNode node) {
        if (node == null) return 0;
        int l = check(node.left); //@left
        if (l == -1) return -1; // neeche toota - right dekhne ki zaroorat nahi //@cut
        int r = check(node.right);
        if (r == -1) return -1;
        if (Math.abs(l - r) > 1) return -1; // yahin toota //@diff
        return 1 + Math.max(l, r); // theek hai - parent ko height chahiye //@ret
    }

    static boolean isBalanced(TreeNode root) {
        return check(root) != -1;
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
        System.out.println(isBalanced(build(1, 2, 3, 4, null, null, null, 5)));
        System.out.println(isBalanced(build(3, 9, 20, null, null, 15, 7)));
    }
}

// Output:
// false
// true
