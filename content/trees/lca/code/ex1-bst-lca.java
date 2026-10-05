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

    // BST: dono ek taraf hain to wahin jao; alag taraf hue to yahi LCA
    static TreeNode lcaBst(TreeNode root, int p, int q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p < cur.val && q < cur.val) cur = cur.left; // dono chhote - LCA left mein //@left
            else if (p > cur.val && q > cur.val) cur = cur.right; // dono bade - right mein //@right
            else return cur; // alag taraf (ya ek yahi hai) - split point //@split
        }
        return null;
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
        TreeNode root = build(6, 2, 8, 0, 4, 7, 9, null, null, 3, 5);
        System.out.println(lcaBst(root, 3, 5).val);
        System.out.println(lcaBst(root, 2, 8).val);
    }
}

// Output:
// 4
// 6
