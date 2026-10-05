import java.util.*;

class Main {
    static List<List<Integer>> emptyBuckets(int capacity) {
        List<List<Integer>> b = new ArrayList<>();
        for (int i = 0; i < capacity; i++) b.add(new ArrayList<>());
        return b;
    }

    // Load factor 0.75 cross hote hi capacity double aur saari keys dobara daalo (rehash)
    public static void main(String[] args) {
        int capacity = 4;
        List<List<Integer>> buckets = emptyBuckets(capacity);
        int size = 0;
        for (int k : new int[]{5, 9, 13, 2, 6}) {
            buckets.get(k % capacity).add(k); //@insert
            size++;
            if (size > 0.75 * capacity) { // bahut bhar gaya - chains lambi hongi //@check
                List<List<Integer>> old = buckets;
                capacity *= 2;
                buckets = emptyBuckets(capacity);
                for (List<Integer> list : old) {
                    for (int x : list) buckets.get(x % capacity).add(x); // har key ki NAYI jagah (capacity badli!) //@rehash
                }
            }
        }
        System.out.println("capacity = " + capacity);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < capacity; i++) {
            if (i > 0) sb.append(' ');
            sb.append(buckets.get(i));
        }
        System.out.println(sb);
    }
}

// Output:
// capacity = 8
// [] [9] [2] [] [] [5, 13] [6] []
