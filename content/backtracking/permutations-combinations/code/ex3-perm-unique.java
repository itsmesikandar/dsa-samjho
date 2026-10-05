import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // Input mein duplicates ho sakte hain. Saare ALAG permutations (koi dobara nahi).
    static List<List<Integer>> permuteUnique(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a); // same values paas-paas aa jaayein
        List<List<Integer>> res = new ArrayList<>();
        bt(a, new boolean[a.length], new ArrayList<>(), res);
        return res;
    }

    static void bt(int[] a, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == a.length) { //@found
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < a.length; i++) {
            if (used[i]) continue;
            // same value ka PICHHLA copy is level par abhi khaali hai (wapas aa chuka) -> ye raasta pehle ho chuka
            if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) continue; //@skip
            used[i] = true; //@choose
            path.add(a[i]);
            bt(a, used, path, res);
            path.remove(path.size() - 1); //@unchoose
            used[i] = false;
        }
    }

    public static void main(String[] args) {
        System.out.println(permuteUnique(new int[]{1, 1, 2}));
        System.out.println(permuteUnique(new int[]{2, 2, 2}));
    }
}

// Output:
// [[1, 1, 2], [1, 2, 1], [2, 1, 1]]
// [[2, 2, 2]]
