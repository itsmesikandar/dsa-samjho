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

    // Koi root-se-leaf raasta hai jiske nodes ka sum = target?
    static boolean hasPathSum(TreeNode root, int target) {
        if (root == null) return false; //@base
        int remain = target - root.val; // apna hissa ghatao, baaki bachchon se maango //@visit
        if (root.left == null && root.right == null) return remain == 0; // leaf par hisaab poora hua? //@leaf
        return hasPathSum(root.left, remain) || hasPathSum(root.right, remain); //@recurse
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
        System.out.println(hasPathSum(build(5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1), 22));
        System.out.println(hasPathSum(build(1, 2, 3), 5));
    }
}

// Output:
// true
// false
