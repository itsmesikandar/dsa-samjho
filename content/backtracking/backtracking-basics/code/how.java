import java.util.ArrayList;
import java.util.List;

class Main {
    // Saare subsets (power set). Backtracking: choose -> explore -> un-choose
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        bt(nums, 0, new ArrayList<>(), res);
        return res;
    }

    static void bt(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path)); // har node khud ek subset hai - COPY daalo (path aage badlega) //@add
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]); // choose //@choose
            bt(nums, i + 1, path, res); // explore: sirf aage ke items (peeche wale lene se same subset dobara banega)
            path.remove(path.size() - 1); // un-choose: wapas pehle jaisi halat //@unchoose
        }
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1, 2, 3}));
        System.out.println(subsets(new int[]{0}));
    }
}

// Output:
// [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
// [[], [0]]
