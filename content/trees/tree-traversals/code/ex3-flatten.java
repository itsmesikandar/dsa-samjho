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

    // Tree ko PREORDER order mein ek seedhi chain banao: sab right se jude, left null. In-place, O(1) extra.
    static void flatten(TreeNode root) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left != null) { // left subtree ko cur aur cur.right ke BEECH ghusao //@hasLeft
                TreeNode tail = cur.left;
                while (tail.right != null) tail = tail.right; // left subtree ka preorder mein aakhri = sabse daayein //@tail
                tail.right = cur.right; // purana right subtree uske baad
                cur.right = cur.left; // left ab right ki jagah //@move
                cur.left = null;
            }
            cur = cur.right; // agla node (preorder ka agla) //@next
        }
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

    static List<Integer> chain(TreeNode root) { // right pointers par chalo
        List<Integer> out = new ArrayList<>();
        for (TreeNode c = root; c != null; c = c.right) out.add(c.val);
        return out;
    }

    public static void main(String[] args) {
        TreeNode t = build(1, 2, 5, 3, 4, null, 6);
        flatten(t);
        System.out.println(chain(t));
        TreeNode one = build(0);
        flatten(one);
        System.out.println(chain(one));
    }
}

// Output:
// [1, 2, 3, 4, 5, 6]
// [0]
