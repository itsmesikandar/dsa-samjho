import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;

        TreeNode(int val) {
            this.val = val;
        }
    }

    static int p; // preorder mein agla root kaun
    static Map<Integer, Integer> pos; // value -> inorder index (root ki jagah O(1) mein)

    // Preorder aur inorder (values alag-alag) diye hain - tree wapas banao
    static TreeNode buildTree(int[] pre, int[] ino) {
        pos = new HashMap<>();
        for (int i = 0; i < ino.length; i++) pos.put(ino[i], i);
        p = 0;
        return make(pre, 0, ino.length - 1);
    }

    static TreeNode make(int[] pre, int lo, int hi) { // inorder[lo..hi] wala subtree banao
        if (lo > hi) return null; //@base
        int v = pre[p++]; // preorder ka agla = is subtree ka ROOT //@root
        TreeNode node = new TreeNode(v);
        int m = pos.get(v); // inorder mein root ke left = left subtree, right = right //@split
        node.left = make(pre, lo, m - 1); // pehle left: preorder mein left subtree wale pehle aate hain
        node.right = make(pre, m + 1, hi);
        return node;
    }

    static List<Integer> serialize(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            if (n == null) {
                out.add(null);
                continue;
            }
            out.add(n.val);
            q.add(n.left);
            q.add(n.right);
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    public static void main(String[] args) {
        System.out.println(serialize(buildTree(new int[]{3, 9, 20, 15, 7}, new int[]{9, 3, 15, 20, 7})));
        System.out.println(serialize(buildTree(new int[]{-1}, new int[]{-1})));
    }
}

// Output:
// [3, 9, 20, null, null, 15, 7]
// [-1]
