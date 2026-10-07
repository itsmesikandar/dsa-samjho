import java.util.*;

class Main {
    // Kitne subarrays ka sum = k? Prefix sum + HashMap
    static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>(); // prefix sum -> kitni baar aaya
        count.put(0, 1); // "kuch nahi liya" wala prefix - shuru se shuru hone wale subarrays ke liye //@init
        int pre = 0, ans = 0;
        for (int x : nums) {
            pre += x; // ab tak ka total //@pre
            ans += count.getOrDefault(pre - k, 0); // pehle kitni baar prefix = pre - k tha? //@lookup
            count.merge(pre, 1, Integer::sum); // apna prefix bhi count karo //@store
        }
        return ans; //@done
    }

    public static void main(String[] args) {
        System.out.println(subarraySum(new int[]{1, 2, 3}, 3)); // [1, 2] aur [3]
        System.out.println(subarraySum(new int[]{1, -1, 1, -1}, 0)); // negative numbers bhi
    }
}

// Output:
// 2
// 4
