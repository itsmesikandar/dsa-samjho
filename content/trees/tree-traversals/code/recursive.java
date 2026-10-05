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

    // Teeno DFS orders - farak sirf ek line ki jagah ka: node ko KAB likhte ho
    static void preorder(TreeNode r, List<Integer> out) {
        if (r == null) return;
        out.add(r.val); // pehle node
        preorder(r.left, out);
        preorder(r.right, out);
    }

    static void inorder(TreeNode r, List<Integer> out) {
        if (r == null) return;
        inorder(r.left, out);
        out.add(r.val); // beech mein node
        inorder(r.right, out);
    }

    static void postorder(TreeNode r, List<Integer> out) {
        if (r == null) return;
        postorder(r.left, out);
        postorder(r.right, out);
        out.add(r.val); // aakhir mein node
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
        TreeNode t = build(1, 2, 3, 4, 5);
        List<Integer> a = new ArrayList<>(), b = new ArrayList<>(), c = new ArrayList<>();
        preorder(t, a);
        inorder(t, b);
        postorder(t, c);
        System.out.println("pre:  " + a);
        System.out.println("in:   " + b);
        System.out.println("post: " + c);
    }
}

// Output:
// pre:  [1, 2, 4, 5, 3]
// in:   [4, 2, 5, 1, 3]
// post: [4, 5, 2, 3, 1]
