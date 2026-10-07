import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    public static void main(String[] args) {
        Deque<Integer> d = new ArrayDeque<>(); // deque: dono edges par jodo / nikaalo, sab O(1)
        d.offerLast(2);
        d.offerFirst(1); // aage jodo
        d.offerLast(3); // peeche jodo
        System.out.println(d);
        System.out.println(d.peekFirst()); // aage wala (khaali par null)
        System.out.println(d.peekLast()); // peeche wala
        d.pollFirst();
        d.pollLast();
        System.out.println(d);
    }
}

// Output:
// [1, 2, 3]
// 1
// 3
// [2]
