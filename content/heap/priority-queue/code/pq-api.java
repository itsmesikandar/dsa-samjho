import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> minPq = new PriorityQueue<>(); // default: chhota upar
        PriorityQueue<Integer> maxPq = new PriorityQueue<>(Collections.reverseOrder()); // bada upar
        for (int x : new int[] {5, 1, 8, 3, 2}) {
            minPq.add(x); // offer() bhi same
            maxPq.add(x);
        }
        System.out.println(minPq.peek()); // dekha, nikaala nahi; khaali par null
        System.out.println(minPq); // andar ka ARRAY - sorted nahi!
        List<Integer> sorted = new ArrayList<>();
        while (!minPq.isEmpty()) sorted.add(minPq.poll()); // nikaalo; khaali par null
        System.out.println(sorted);
        System.out.println(maxPq.poll());

        // Object / pair: Comparator do. Yahan pehle length, barabar ho to alphabet
        PriorityQueue<String> words = new PriorityQueue<>(Comparator.comparingInt(String::length).thenComparing(s -> s));
        words.addAll(List.of("kela", "aam", "seb", "angoor"));
        System.out.println(words.poll() + " " + words.poll());
    }
}

// Output:
// 1
// [1, 2, 8, 5, 3]
// [1, 2, 3, 5, 8]
// 8
// common seb
