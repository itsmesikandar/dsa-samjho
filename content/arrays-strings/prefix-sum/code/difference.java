import java.util.*;

class Main {
    // Difference array: "range mein v jodo" wale bahut saare updates, har ek O(1)
    static int[] applyUpdates(int n, List<int[]> updates) {
        int[] diff = new int[n + 1];
        for (int[] u : updates) {
            int l = u[0], r = u[1], v = u[2];
            diff[l] += v; // yahan se v shuru
            diff[r + 1] -= v; // r ke baad v khatam
        }
        // prefix sum lagao -> asli values
        int[] arr = new int[n];
        int running = 0;
        for (int i = 0; i < n; i++) {
            running += diff[i];
            arr[i] = running;
        }
        return arr;
    }

    public static void main(String[] args) {
        // [1..3] mein +5, [2..5] mein +2
        List<int[]> updates = List.of(new int[]{1, 3, 5}, new int[]{2, 5, 2});
        System.out.println(Arrays.toString(applyUpdates(6, updates)));
    }
}

// Output:
// [0, 5, 7, 7, 2, 2]
