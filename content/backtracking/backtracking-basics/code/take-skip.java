import java.util.ArrayList;
import java.util.List;

class Main {
    // Doosra structure: har item par 2 raaste - lo ya chhodo (binary decision tree)
    static List<List<Integer>> subsetsBinary(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        go(nums, 0, new ArrayList<>(), res);
        return res;
    }

    static void go(int[] nums, int i, List<Integer> path, List<List<Integer>> res) {
        if (i == nums.length) { // saare items ka decision ho gaya: ek poora subset
            res.add(new ArrayList<>(path));
            return;
        }
        path.add(nums[i]); // nums[i] LO
        go(nums, i + 1, path, res);
        path.remove(path.size() - 1); // wapas
        go(nums, i + 1, path, res); // nums[i] CHHODO
    }

    public static void main(String[] args) {
        System.out.println(subsetsBinary(new int[]{1, 2, 3}));
    }
}

// Output:
// [[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]
