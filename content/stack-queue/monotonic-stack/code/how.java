import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Main {
    // Har item ke liye: uske DAAYEIN pehla bada number (na ho to -1)
    static int[] nextGreater(int[] nums) {
        int[] res = new int[nums.length];
        Arrays.fill(res, -1);
        Deque<Integer> st = new ArrayDeque<>(); // INDEXES jinka answer abhi nahi mila; values neeche se upar ghatti hui
        for (int i = 0; i < nums.length; i++) {
            while (!st.isEmpty() && nums[st.peek()] < nums[i]) { // nums[i] in sabka pehla bada hai //@pop
                res[st.pop()] = nums[i];
            }
            st.push(i); // i ka answer abhi baaki - intezaar karo //@push
        }
        return res; // stack mein bache: daayein koi bada nahi -> -1 hi raha //@done
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{2, 1, 2, 4, 3})));
        System.out.println(Arrays.toString(nextGreater(new int[]{5, 4, 3})));
    }
}

// Output:
// [4, 2, 4, -1, -1]
// [-1, -1, -1]
