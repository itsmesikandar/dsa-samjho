import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // 2 stacks se queue (FIFO): naye items 'inbox' mein, nikaalna 'outbox' se
    static class MyQueue {
        private final Deque<Integer> inbox = new ArrayDeque<>();
        private final Deque<Integer> outbox = new ArrayDeque<>();

        void push(int x) {
            inbox.push(x); //@push
        }

        int pop() {
            move();
            return outbox.pop(); // outbox ka top = sabse purana item //@pop
        }

        int peek() {
            move();
            return outbox.peek();
        }

        boolean empty() {
            return inbox.isEmpty() && outbox.isEmpty();
        }

        // outbox KHAALI ho tabhi inbox ko ulta karke daalo - har item zindagi mein ek hi baar shift hota hai
        private void move() {
            if (outbox.isEmpty()) {
                while (!inbox.isEmpty()) outbox.push(inbox.pop()); //@move
            }
        }
    }

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1);
        q.push(2);
        System.out.println(q.peek());
        System.out.println(q.pop());
        q.push(3);
        System.out.println(q.pop());
        System.out.println(q.pop());
        System.out.println(q.empty());
    }
}

// Output:
// 1
// 1
// 2
// 3
// true
