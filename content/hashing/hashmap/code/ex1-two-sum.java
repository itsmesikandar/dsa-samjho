import java.util.*;

class Main {
    // 2 index jinke numbers ka sum = target. Har number ke liye: uska "pair" pehle dekha hai?
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value -> index //@init
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i]; // pair ke liye kya chahiye? //@need
            Integer j = seen.get(need);
            if (j != null) return new int[]{j, i}; // pehle dekha hua mil gaya! //@found
            seen.put(nums[i], i); // apne aap ko yaad rakho - aage koi pair dhoondhega //@store
        }
        return new int[]{-1, -1}; //@none
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6)));
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // same value 2 baar
    }
}

// Output:
// [0, 1]
// [1, 2]
// [0, 1]
