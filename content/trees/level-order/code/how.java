import java.util.ArrayDeque;
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

    // Level by level: har level ki values alag list mein
    static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root); //@start
        while (!q.isEmpty()) {
            int size = q.size(); // ABHI queue mein jitne hain = poora ek level (naye bachche baad mein aayenge) //@level
            List<Integer> level = new ArrayList<>();
            for (int k = 0; k < size; k++) {
                TreeNode n = q.poll(); //@pop
                level.add(n.val);
                if (n.left != null) q.add(n.left); // bachche agle level ke liye peeche lagte hain //@push
                if (n.right != null) q.add(n.right);
            }
            res.add(level); //@done
        }
        return res;
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
        System.out.println(levelOrder(build(3, 9, 20, null, null, 15, 7)));
        System.out.println(levelOrder(build(1)));
    }
}

// Output:
// [[3], [9, 20], [15, 7]]
// [[1]]
