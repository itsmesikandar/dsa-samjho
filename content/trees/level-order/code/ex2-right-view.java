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

    // Tree ko RIGHT se dekho: har level ka sabse right node dikhega. Upar se neeche woh values.
    static List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            for (int k = 0; k < size; k++) {
                TreeNode n = q.poll();
                if (k == size - 1) res.add(n.val); // level ka AAKHRI = sabse right //@last
                if (n.left != null) q.add(n.left); //@push
                if (n.right != null) q.add(n.right);
            }
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
        System.out.println(rightSideView(build(1, 2, 3, null, 5, null, 4, 6))); // 6 left bachcha hai par us level par akela - dikhega
        System.out.println(rightSideView(build(1, 2, 3, 4)));
    }
}

// Output:
// [1, 3, 4, 6]
// [1, 3, 4]
