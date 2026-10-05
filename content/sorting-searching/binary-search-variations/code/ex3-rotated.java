class Main {
    // Sorted (distinct) array ko kisi point par ghuma diya. Target ka index; na ho to -1. O(log n).
    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) return mid; //@found
            if (a[lo] <= a[mid]) { // left half [lo..mid] pakka sorted hai //@leftSorted
                if (target >= a[lo] && target < a[mid]) hi = mid - 1; // target usi sorted hisse mein
                else lo = mid + 1;
            } else { // warna right half [mid..hi] sorted hai //@rightSorted
                if (target > a[mid] && target <= a[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1; //@none
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0));
        System.out.println(search(new int[]{4, 5, 6, 7, 0, 1, 2}, 3));
    }
}

// Output:
// 4
// -1
