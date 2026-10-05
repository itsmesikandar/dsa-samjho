import java.util.*;

class Main {
    // Apna chhota HashMap: buckets ka array, har bucket mein ek list (chaining)
    static class MyHashMap {
        static class Entry {
            int key;
            String value;

            Entry(int key, String value) {
                this.key = key;
                this.value = value;
            }
        }

        private final int capacity;
        private final List<List<Entry>> buckets = new ArrayList<>();

        MyHashMap(int capacity) {
            this.capacity = capacity;
            for (int i = 0; i < capacity; i++) buckets.add(new ArrayList<>());
        }

        // key -> bucket number (negative key ke liye bhi sahi)
        private int indexOf(int key) {
            return Math.floorMod(key, capacity); //@hash
        }

        void put(int key, String value) {
            List<Entry> bucket = buckets.get(indexOf(key));
            for (Entry e : bucket) {
                if (e.key == key) { // key pehle se hai: sirf value badlo //@update
                    e.value = value;
                    return;
                }
            }
            bucket.add(new Entry(key, value)); // nayi key: bucket ki list mein jodo (chaining) //@add
        }

        String get(int key) {
            for (Entry e : buckets.get(indexOf(key))) { // sirf EK bucket dekho, poora map nahi //@scan
                if (e.key == key) return e.value;
            }
            return null; // is bucket mein nahi = map mein hi nahi //@miss
        }
    }

    public static void main(String[] args) {
        MyHashMap m = new MyHashMap(5);
        m.put(12, "chai");
        m.put(7, "samosa"); // 7 % 5 = 2, 12 % 5 = 2 -> collision!
        m.put(9, "pakoda");
        m.put(17, "jalebi"); // ye bhi bucket 2
        m.put(12, "coffee"); // update
        System.out.println(m.get(17));
        System.out.println(m.get(12));
        System.out.println(m.get(3));
    }
}

// Output:
// jalebi
// coffee
// null
