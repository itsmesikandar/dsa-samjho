import java.util.Arrays;

class Main {
    // Envelope andar tabhi jaata jab width aur height DONO chhote. Width se sort (same width par height ULTI), phir heights par LIS
    static int maxEnvelopes(int[][] envelopes) {
        Arrays.sort(envelopes, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1])); // same width - bada pehle, taaki dono ek chain mein na aayen //@sort
        int[] tails = new int[envelopes.length];
        int size = 0;
        for (int[] e : envelopes) {
            int h = e[1];
            int lo = 0;
            int hi = size;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails[mid] < h) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = h; // heights par O(n log n) LIS //@place
            if (lo == size) size++;
        }
        return size; //@done
    }

    public static void main(String[] args) {
        int[][] env = {{3, 4}, {5, 6}, {5, 5}, {5, 7}, {2, 2}, {6, 8}};
        System.out.println(maxEnvelopes(env));
        System.out.println(maxEnvelopes(new int[][] {{1, 1}, {1, 1}}));
    }
}

// Output:
// 4
// 1
