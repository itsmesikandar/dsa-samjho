import java.util.Collections;
import java.util.PriorityQueue;

class Main {
    // Har baar do sabse bhaari patthar takraao: max-heap se dono turant milte hain
    static int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder()); // max-heap //@build
        for (int s : stones) pq.add(s);
        while (pq.size() > 1) {
            int y = pq.poll(); // sabse bhaari; int mein lo, Integer != mat karo //@take
            int x = pq.poll(); // doosra sabse bhaari
            if (y != x) pq.add(y - x); // bada bacha hua tukda wapas //@push
        }
        return pq.isEmpty() ? 0 : pq.peek(); //@end
    }

    public static void main(String[] args) {
        System.out.println(lastStoneWeight(new int[] {2, 7, 4, 1, 8, 1}));
        System.out.println(lastStoneWeight(new int[] {3, 3}));
        System.out.println(lastStoneWeight(new int[] {1000, 200}));
    }
}

// Output:
// 1
// 0
// 800
