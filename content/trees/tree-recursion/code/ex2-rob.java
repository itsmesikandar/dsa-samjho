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

    // Har node do jawab bhejta hai: {isko loota, isko chhoda}
    static int[] rob(TreeNode node) {
        if (node == null) return new int[] {0, 0};
        int[] l = rob(node.left);
        int[] r = rob(node.right);
        int take = node.val + l[1] + r[1]; // loota to bachche chhodne padenge //@take
        int skip = Math.max(l[0], l[1]) + Math.max(r[0], r[1]); // chhoda to bachche apna best de //@skip
        return new int[] {take, skip};
    }

    static int robTree(TreeNode root) {
        int[] res = rob(root);
        return Math.max(res[0], res[1]);
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
        System.out.println(robTree(build(3, 4, 5, 1, 3, null, 1)));
        System.out.println(robTree(build(3, 2, 3, null, 3, null, 1)));
    }
}

// Output:
// 9
// 7
