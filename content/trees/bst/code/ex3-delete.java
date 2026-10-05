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

    // key hatao, naye subtree ka root return karo
    static TreeNode delete(TreeNode node, int key) {
        if (node == null) return null; // key tree mein hai hi nahi //@miss
        if (key < node.val) node.left = delete(node.left, key); //@left
        else if (key > node.val) node.right = delete(node.right, key); //@right
        else {
            if (node.left == null) return node.right; // 0 ya 1 bachcha: bachcha jagah le //@one
            if (node.right == null) return node.left;
            TreeNode s = node.right; // 2 bachche: right subtree ka sabse chhota (successor) //@succ
            while (s.left != null) s = s.left;
            node.val = s.val; // successor ki value yahan copy //@copy
            node.right = delete(node.right, s.val); // purana successor hatao (uska left nahi hota) //@again
        }
        return node;
    }

    static List<Integer> preorder(TreeNode node, List<Integer> out) {
        if (node != null) {
            out.add(node.val);
            preorder(node.left, out);
            preorder(node.right, out);
        }
        return out;
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
        System.out.println(preorder(delete(build(8, 3, 12, 1, 6, 10, 15, null, null, null, null, null, 11), 8), new ArrayList<>()));
        System.out.println(preorder(delete(build(5, 3, 6, 2, 4, null, 7), 6), new ArrayList<>()));
    }
}

// Output:
// [10, 3, 1, 6, 12, 11, 15]
// [5, 3, 2, 4, 7]
