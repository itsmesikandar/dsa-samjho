import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

class Main {
    // nums1 ke har number ke liye: nums2 mein usi number ke DAAYEIN pehla bada (na ho to -1). nums1 subset of nums2, sab distinct.
    static int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer, Integer> next = new HashMap<>(); // value -> uska next greater (nums2 mein)
        Deque<Integer> st = new ArrayDeque<>(); // values jinka next greater abhi nahi mila
        for (int x : nums2) {
            while (!st.isEmpty() && st.peek() < x) next.put(st.pop(), x); //@pop
            st.push(x); //@push
        }
        int[] res = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) res[i] = next.getOrDefault(nums1[i], -1); // map mein nahi = koi bada nahi //@lookup
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreaterElement(new int[]{4, 1, 2}, new int[]{1, 3, 4, 2})));
        System.out.println(Arrays.toString(nextGreaterElement(new int[]{2, 4}, new int[]{1, 2, 3, 4})));
    }
}

// Output:
// [-1, 3, -1]
// [3, -1]
