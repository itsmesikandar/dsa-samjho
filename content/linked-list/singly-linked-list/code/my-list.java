import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

class Main {
    // Apni chhoti LinkedList: head + tail + size
    static class MyLinkedList {
        private static class Node {
            final int value;
            Node next;

            Node(int value, Node next) {
                this.value = value;
                this.next = next;
            }
        }

        private Node head;
        private Node tail; // aakhri node yaad rakho: addLast O(1)
        private int size;

        void addFirst(int x) {
            Node n = new Node(x, head);
            head = n;
            if (tail == null) tail = n; // pehla hi node: head = tail
            size++;
        }

        void addLast(int x) {
            Node n = new Node(x, null);
            if (tail == null) head = n;
            else tail.next = n;
            tail = n;
            size++;
        }

        int removeFirst() {
            if (head == null) throw new NoSuchElementException("list khaali hai");
            Node h = head;
            head = h.next;
            if (head == null) tail = null; // aakhri node gaya: tail bhi saaf
            size--;
            return h.value;
        }

        int get(int i) { // index se lena O(i) - array jaisa O(1) nahi
            Node cur = head;
            for (int k = 0; k < i && cur != null; k++) cur = cur.next;
            if (cur == null) throw new IndexOutOfBoundsException("index " + i);
            return cur.value;
        }

        int size() {
            return size;
        }

        @Override
        public String toString() {
            List<Integer> parts = new ArrayList<>();
            for (Node cur = head; cur != null; cur = cur.next) parts.add(cur.value);
            return parts.toString();
        }
    }

    public static void main(String[] args) {
        MyLinkedList list = new MyLinkedList();
        list.addLast(2);
        list.addLast(3);
        list.addFirst(1);
        System.out.println(list);
        System.out.println(list.get(2));
        System.out.println(list.removeFirst());
        System.out.println(list);
        System.out.println(list.size());
    }
}

// Output:
// [1, 2, 3]
// 3
// 1
// [2, 3]
// 2
