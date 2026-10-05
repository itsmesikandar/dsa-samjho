import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // Histogram ke bars (har ek ki width 1). Inke andar sabse bada rectangle - area?
    static int largestRectangleArea(int[] h) {
        Deque<Integer> st = new ArrayDeque<>(); // indexes, heights neeche se upar BADHTE hue
        int best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = (i == h.length) ? 0 : h[i]; // aakhir mein nakli 0 height: bache sab bars pop ho jaayein
            while (!st.isEmpty() && h[st.peek()] >= cur) { // top bar ki height wala rectangle ab daayein nahi badh sakta //@pop
                int height = h[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek(); // isse chhota pichhla bar = left deewar
                best = Math.max(best, height * (i - left - 1)); // width = left aur i ke beech ke bars //@area
            }
            st.push(i); //@push
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3}));
        System.out.println(largestRectangleArea(new int[]{2, 4}));
    }
}

// Output:
// 10
// 4
