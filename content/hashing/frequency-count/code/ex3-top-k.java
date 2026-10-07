import java.util.*;

class Main {
    // Sabse zyada baar aane wale k numbers - bucket sort se O(n), bina poora sort kiye
    static List<Integer> topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum); // pehle count //@count
        // bucket[f] = wo numbers jo exactly f baar aaye. f zyada se zyada n ho sakta hai.
        List<List<Integer>> bucket = new ArrayList<>(); //@bucket
        for (int i = 0; i <= nums.length; i++) bucket.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) bucket.get(e.getValue()).add(e.getKey());
        List<Integer> res = new ArrayList<>();
        for (int f = nums.length; f >= 1; f--) { // sabse badi frequency se neeche aao
            List<Integer> b = new ArrayList<>(bucket.get(f));
            Collections.sort(b); // (sorted sirf output fix rakhne ke liye)
            for (int x : b) { //@pick
                if (res.size() < k) res.add(x);
            }
        }
        return res; //@done
    }

    public static void main(String[] args) {
        System.out.println(topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2));
        System.out.println(topKFrequent(new int[]{4, 4, 5, 5, 6}, 2));
    }
}

// Output:
// [1, 2]
// [4, 5]
