class Main {
    // Target ka index do; na ho to wo index jahan daalne par array sorted rahe
    static int searchInsert(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2; //@mid
            if (a[mid] == target) return mid; //@found
            if (a[mid] < target) lo = mid + 1; //@right
            else hi = mid - 1; //@left
        }
        return lo; // loop khatam: lo = pehla index jahan a[lo] > target (ya end) //@insert
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5, 6};
        System.out.println(searchInsert(a, 2));
        System.out.println(searchInsert(a, 5));
        System.out.println(searchInsert(a, 7));
    }
}

// Output:
// 1
// 2
// 4
