import java.util.Arrays;

class Main {
    // Har bucket mein kitni keys giri? (index = key % m)
    static int[] bucketCounts(int[] keys, int m) {
        int[] counts = new int[m];
        for (int k : keys) {
            counts[Math.floorMod(k, m)]++; // is key ka bucket //@put
        }
        return counts; //@done
    }

    public static void main(String[] args) {
        int[] counts = bucketCounts(new int[]{12, 7, 19, 25, 30}, 7);
        System.out.println(Arrays.toString(counts));
        // collisions = har bucket mein pehle ke baad wali keys
        int collisions = 0;
        for (int c : counts) collisions += Math.max(0, c - 1);
        System.out.println(collisions);
    }
}

// Output:
// [1, 0, 1, 0, 1, 2, 0]
// 1
