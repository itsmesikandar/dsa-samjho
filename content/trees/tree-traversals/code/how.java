import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
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

    // Inorder (Left, Node, Right) bina recursion - apna stack
    static List<Integer> inorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { // jitna ho sake left jao; raaste ke nodes stack par (inhe baad mein dekhna hai) //@push
                st.push(cur);
                cur = cur.left;
            }
            TreeNode node = st.pop(); // left poora ho gaya: ab ye node //@visit
            res.add(node.val);
            cur = node.right; // ab iska right subtree - wahi process //@right
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
        System.out.println(inorder(build(4, 2, 6, 1, 3, 5, 7))); // BST ka inorder = sorted!
        System.out.println(inorder(build(1, null, 2, 3)));
    }
}

// Output:
// [1, 2, 3, 4, 5, 6, 7]
// [1, 3, 2]
