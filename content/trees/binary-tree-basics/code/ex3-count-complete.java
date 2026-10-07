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

    // Complete tree (har level bhara, aakhri level left se bhara) ke nodes O(n) se tez count karo
    static int countNodes(TreeNode root) {
        if (root == null) return 0; //@base
        int lh = 0, rh = 0;
        for (TreeNode n = root; n != null; n = n.left) lh++; // sabse left raasta ki length
        for (TreeNode n = root; n != null; n = n.right) rh++; // sabse right raasta ki length
        if (lh == rh) return (1 << lh) - 1; // dono barabar = perfect tree: 2^h - 1, neeche jaana hi nahi //@perfect
        return 1 + countNodes(root.left) + countNodes(root.right); // warna dono taraf (ek taraf pakka perfect hoga) //@split
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
        System.out.println(countNodes(build(1, 2, 3, 4, 5, 6)));
        System.out.println(countNodes(build(1, 2, 3, 4, 5, 6, 7)));
        System.out.println(countNodes(build()));
    }
}

// Output:
// 6
// 7
// 0
