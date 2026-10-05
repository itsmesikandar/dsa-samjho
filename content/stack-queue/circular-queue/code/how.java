class Main {
    // Fixed size ka circular queue: array ke end ke baad index wapas 0 par ghoomta hai
    static class MyCircularQueue {
        private final int[] a;
        private int head = 0; // aage wala item yahan
        private int count = 0; // kitne bhare - isse 'full' aur 'empty' alag pehchaante hain

        MyCircularQueue(int k) {
            a = new int[k];
        }

        boolean enQueue(int x) {
            if (isFull()) return false; //@full
            a[(head + count) % a.length] = x; // peeche ki khaali jagah; end ke baad % se wapas 0 //@enq
            count++;
            return true;
        }

        boolean deQueue() {
            if (isEmpty()) return false; //@empty
            head = (head + 1) % a.length; // aage wala gaya: head ek aage (ghoom ke) - koi shift nahi //@deq
            count--;
            return true;
        }

        int front() {
            return isEmpty() ? -1 : a[head];
        }

        int rear() {
            return isEmpty() ? -1 : a[(head + count - 1) % a.length];
        }

        boolean isEmpty() {
            return count == 0;
        }

        boolean isFull() {
            return count == a.length;
        }
    }

    public static void main(String[] args) {
        MyCircularQueue q = new MyCircularQueue(3);
        System.out.println(q.enQueue(1));
        System.out.println(q.enQueue(2));
        System.out.println(q.enQueue(3));
        System.out.println(q.enQueue(4)); // bhara hai
        System.out.println(q.rear());
        System.out.println(q.isFull());
        System.out.println(q.deQueue());
        System.out.println(q.enQueue(4)); // khaali hui jagah (index 0) dobara use
        System.out.println(q.rear());
    }
}

// Output:
// true
// true
// true
// false
// 3
// true
// true
// true
// 4
