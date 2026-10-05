import java.util.ArrayDeque;
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

    // Level ki width = sabse baayein aur sabse daayein node ke beech ki saari jagahen (beech ke khaali bhi). Max width?
    static int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> nodes = new ArrayDeque<>();
        Queue<Long> pos = new ArrayDeque<>(); // position (complete tree jaisa: bachche 2i aur 2i + 1)
        nodes.add(root);
        pos.add(0L);
        long best = 0;
        while (!nodes.isEmpty()) {
            int size = nodes.size();
            long first = pos.peek(); // is level ka sabse baayein position //@level
            long last = 0;
            for (int k = 0; k < size; k++) {
                TreeNode n = nodes.poll();
                long i = pos.poll() - first; // har level par 0 se gino - warna gehre tree mein numbers overflow //@pos
                last = i;
                if (n.left != null) { //@push
                    nodes.add(n.left);
                    pos.add(2 * i);
                }
                if (n.right != null) {
                    nodes.add(n.right);
                    pos.add(2 * i + 1);
                }
            }
            best = Math.max(best, last + 1); // aakhri - pehla + 1 //@width
        }
        return (int) best;
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
        System.out.println(widthOfBinaryTree(build(1, 3, 2, 5, null, null, 9, 6, null, 7)));
        System.out.println(widthOfBinaryTree(build(1, 3, 2, 5, 3, null, 9)));
        System.out.println(widthOfBinaryTree(build(1, 3, 2, 5)));
    }
}

// Output:
// 7
// 4
// 2
