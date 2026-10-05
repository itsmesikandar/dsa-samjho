import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Main {
    // Har din: kitne din baad zyada garmi padegi? (kabhi na pade to 0)
    static int[] dailyTemperatures(int[] t) {
        int[] res = new int[t.length];
        Deque<Integer> st = new ArrayDeque<>(); // din (index) jinka 'garam din' abhi nahi aaya; temps neeche se upar ghatte
        for (int i = 0; i < t.length; i++) {
            while (!st.isEmpty() && t[st.peek()] < t[i]) { // aaj in sabse garam hai //@pop
                int d = st.pop();
                res[d] = i - d; // value nahi, DOORI chahiye - isliye index rakhe
            }
            st.push(i); //@push
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(dailyTemperatures(new int[]{73, 74, 75, 71, 69, 72, 76, 73})));
        System.out.println(Arrays.toString(dailyTemperatures(new int[]{30, 40, 50, 60})));
    }
}

// Output:
// [1, 1, 4, 2, 1, 1, 0, 0]
// [1, 1, 1, 0]
