import java.util.ArrayList;
import java.util.List;

class Main {
    // Saare permutations (har order). used[] batata hai kaun pehle se path mein hai.
    static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    static void bt(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) { // saari jagah bhar gayi: ek order poora //@found
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) { // har baar SHURU se - order matter karta hai (start index nahi)
            if (used[i]) continue; // ye pehle se liya hua
            used[i] = true; // choose //@choose
            path.add(nums[i]);
            bt(nums, used, path, res);
            path.remove(path.size() - 1); // un-choose: agle option ke liye wapas khaali //@unchoose
            used[i] = false;
        }
    }

    public static void main(String[] args) {
        System.out.println(permute(new int[]{1, 2, 3}));
        System.out.println(permute(new int[]{0, 1}));
    }
}

// Output:
// [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
// [[0, 1], [1, 0]]
