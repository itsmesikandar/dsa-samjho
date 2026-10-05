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

    // [low, high] ke andar wale nodes ka sum; bekaar subtrees skip
    static int rangeSum(TreeNode node, int low, int high) {
        if (node == null) return 0;
        if (node.val < low) return rangeSum(node.right, low, high); // left aur bhi chhota - skip //@low
        if (node.val > high) return rangeSum(node.left, low, high); // right aur bhi bada - skip //@high
        return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high); //@add
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
        System.out.println(rangeSum(build(10, 5, 15, 3, 7, null, 18), 7, 15));
        System.out.println(rangeSum(build(10, 5, 15, 3, 7, 13, 18, 1, null, 6), 6, 10));
    }
}

// Output:
// 32
// 23
