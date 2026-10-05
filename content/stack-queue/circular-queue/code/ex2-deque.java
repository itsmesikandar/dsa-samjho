class Main {
    // Fixed size ka circular DEQUE: aage aur peeche dono taraf jodo / nikaalo
    static class MyCircularDeque {
        private final int[] a;
        private int head = 0, count = 0;

        MyCircularDeque(int k) {
            a = new int[k];
        }

        boolean insertFront(int x) {
            if (isFull()) return false;
            head = (head - 1 + a.length) % a.length; // head ek PEECHE; 0 se pehle = aakhri index //@front
            a[head] = x;
            count++;
            return true;
        }

        boolean insertLast(int x) {
            if (isFull()) return false;
            a[(head + count) % a.length] = x; //@last
            count++;
            return true;
        }

        boolean deleteFront() {
            if (isEmpty()) return false;
            head = (head + 1) % a.length; //@delFront
            count--;
            return true;
        }

        boolean deleteLast() {
            if (isEmpty()) return false;
            count--; // tail = head + count, to count ghata = aakhri apne aap gaya //@delLast
            return true;
        }

        int getFront() {
            return isEmpty() ? -1 : a[head];
        }

        int getRear() {
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
        MyCircularDeque d = new MyCircularDeque(3);
        System.out.println(d.insertLast(1));
        System.out.println(d.insertLast(2));
        System.out.println(d.insertFront(3));
        System.out.println(d.insertFront(4)); // bhara hai
        System.out.println(d.getRear());
        System.out.println(d.isFull());
        System.out.println(d.deleteLast());
        System.out.println(d.insertFront(4));
        System.out.println(d.getFront());
    }
}

// Output:
// true
// true
// true
// false
// 2
// true
// true
// true
// 4
