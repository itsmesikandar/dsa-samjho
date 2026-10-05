import java.util.Arrays;

class Main {
    // Sorted array mein target ki pehli aur aakhri position; na ho to [-1, -1]. O(log n).
    static int[] searchRange(int[] a, int target) {
        int first = lowerBound(a, target); // pehla >= target //@first
        if (first == a.length || a[first] != target) return new int[]{-1, -1}; // target hai hi nahi //@none
        int last = upperBound(a, target) - 1; // pehla > target - uske theek pehle wala aakhri target //@last
        return new int[]{first, last};
    }

    static int lowerBound(int[] a, int x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= x) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    static int upperBound(int[] a, int x) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] > x) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(searchRange(new int[]{5, 7, 7, 8, 8, 10}, 8)));
        System.out.println(Arrays.toString(searchRange(new int[]{5, 7, 7, 8, 8, 10}, 6)));
    }
}

// Output:
// [3, 4]
// [-1, -1]
