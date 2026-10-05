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

    // Search ka raasta pakdo; jahan null mile wahi naye node ki jagah
    static TreeNode insert(TreeNode node, int key) {
        if (node == null) return new TreeNode(key); // khaali jagah - naya node yahin //@new
        if (key < node.val) node.left = insert(node.left, key); // chhota - left mein dhoondho //@left
        else if (key > node.val) node.right = insert(node.right, key); // bada - right mein //@right
        return node; // barabar ho to pehle se hai - kuch mat karo //@same
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
        TreeNode root = insert(build(8, 3, 10, 1, 6, null, 14, null, null, 4, 7), 5);
        System.out.println(preorder(root, new ArrayList<>()));
        TreeNode t = null;
        for (int x : new int[] {4, 2, 6, 1}) t = insert(t, x);
        System.out.println(preorder(t, new ArrayList<>()));
    }
}

// Output:
// [8, 3, 1, 6, 4, 5, 7, 10, 14]
// [4, 2, 1, 6]
