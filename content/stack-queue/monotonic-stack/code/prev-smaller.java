import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Main {
    // Har item ke liye: uske BAAYEIN pehla chhota number (na ho to -1)
    static int[] previousSmaller(int[] nums) {
        int[] res = new int[nums.length];
        Deque<Integer> st = new ArrayDeque<>(); // values, neeche se upar BADHTE hue
        for (int i = 0; i < nums.length; i++) {
            int x = nums[i];
            // x se bade/barabar hatao: x ke baad aane walon ke liye x hi behtar (paas + chhota) 'chhota' hai
            while (!st.isEmpty() && st.peek() >= x) st.pop();
            res[i] = st.isEmpty() ? -1 : st.peek(); // jo bacha top par wahi baayein pehla chhota
            st.push(x);
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(previousSmaller(new int[]{4, 5, 2, 10, 8})));
    }
}

// Output:
// [-1, 4, -1, 2, 2]
