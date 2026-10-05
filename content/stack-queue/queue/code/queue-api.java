import java.util.ArrayDeque;
import java.util.Queue;

class Main {
    public static void main(String[] args) {
        Queue<String> q = new ArrayDeque<>(); // queue: offer peeche, poll aage se
        q.offer("Ravi"); // enqueue
        q.offer("Anu");
        q.offer("Zoya");
        System.out.println(q.peek()); // aage kaun hai (nikaalo mat); khaali par null
        System.out.println(q.poll()); // dequeue: jo pehle aaya wo pehle gaya; khaali par null
        System.out.println(q);
        System.out.println(q.size());
    }
}

// Output:
// Ravi
// Ravi
// [Anu, Zoya]
// 2
