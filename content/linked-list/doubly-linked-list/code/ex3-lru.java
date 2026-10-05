import java.util.HashMap;
import java.util.Map;

class Main {
    // LRU Cache: capacity bhar jaaye to sabse PURANA use hua item nikaalo. get/put dono O(1).
    static class LRUCache {
        private static class Node {
            final int key;
            int value;
            Node prev, next;

            Node(int key, int value) {
                this.key = key;
                this.value = value;
            }
        }

        private final int capacity;
        private final Map<Integer, Node> map = new HashMap<>(); // key -> node: O(1) mein node haath mein
        private final Node head = new Node(0, 0); // head ke baad = sabse naya use hua
        private final Node tail = new Node(0, 0); // tail se pehle = sabse purana (pehle niklega)

        LRUCache(int capacity) {
            this.capacity = capacity;
            head.next = tail;
            tail.prev = head;
        }

        private void unlink(Node n) { // doubly ka fayda: O(1) mein beech se nikaalo
            n.prev.next = n.next;
            n.next.prev = n.prev;
        }

        private void addFront(Node n) {
            n.next = head.next;
            n.prev = head;
            head.next.prev = n;
            head.next = n;
        }

        int get(int key) {
            Node n = map.get(key);
            if (n == null) return -1; //@miss
            unlink(n); // abhi use hua: sabse aage le jao //@touch
            addFront(n);
            return n.value;
        }

        void put(int key, int value) {
            Node old = map.get(key);
            if (old != null) { // pehle se hai: value badlo, aage le jao //@update
                old.value = value;
                unlink(old);
                addFront(old);
                return;
            }
            if (map.size() == capacity) { // jagah nahi: sabse purana (tail se pehle wala) nikaalo //@evict
                Node lru = tail.prev;
                unlink(lru);
                map.remove(lru.key);
            }
            Node n = new Node(key, value); //@insert
            addFront(n);
            map.put(key, n);
        }
    }

    public static void main(String[] args) {
        LRUCache c = new LRUCache(2);
        c.put(1, 1);
        c.put(2, 2);
        System.out.println(c.get(1)); // 1 ab sabse naya
        c.put(3, 3); // jagah nahi: 2 (sabse purana) gaya
        System.out.println(c.get(2));
        c.put(4, 4); // ab 1 sabse purana: gaya
        System.out.println(c.get(1));
        System.out.println(c.get(3));
        System.out.println(c.get(4));
    }
}

// Output:
// 1
// -1
// -1
// 3
// 4
