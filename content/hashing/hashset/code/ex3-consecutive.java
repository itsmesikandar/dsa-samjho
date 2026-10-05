import java.util.*;

class Main {
    // Sabse lambi lagatar (consecutive) numbers ki sequence - O(n), bina sort
    static int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>(); //@build
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (set.contains(x - 1)) continue; // x se pehle wala hai -> x shuruaat nahi, skip //@skip
            int len = 1;
            while (set.contains(x + len)) len++; // shuruaat se aage ginte jao //@count
            best = Math.max(best, len); //@best
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestConsecutive(new int[]{100, 4, 200, 1, 3, 2})); // 1, 2, 3, 4
        System.out.println(longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1})); // 0..8
    }
}

// Output:
// 4
// 9
