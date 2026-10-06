import java.util.ArrayList;
import java.util.List;

class Main {
    // Bitmask: n items ke 2^n subsets = 0 se 2^n - 1 tak ke numbers. Bit i on = nums[i] liya
    static List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> all = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) { // har mask ek subset //@mask
            List<Integer> cur = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if (((mask >> i) & 1) == 1) cur.add(nums[i]); // bit i on - nums[i] lo (brackets zaroori) //@pick
            }
            all.add(cur);
        }
        return all; //@done
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[] {1, 2, 3}));
        System.out.println(subsets(new int[] {9}));
    }
}

// Output:
// [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
// [[], [9]]
