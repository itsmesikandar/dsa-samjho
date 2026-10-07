class Main {
    // Sorted array mein target ka index; na mile to -1
    static int binarySearch(int[] a, int target) {
        int lo = 0;
        int hi = a.length - 1; // [lo, hi] = jahan answer ho sakta hai //@init
        while (lo <= hi) { // range khaali nahi hui
            int mid = lo + (hi - lo) / 2; // (lo + hi) / 2 bade index par overflow kar sakta hai //@mid
            if (a[mid] == target) return mid; //@found
            if (a[mid] < target) lo = mid + 1; // target right mein: mid including left aadha bekaar //@right
            else hi = mid - 1; // target left mein //@left
        }
        return -1; // range khaali: target hai hi nahi //@none
    }

    public static void main(String[] args) {
        int[] a = {-1, 0, 3, 5, 9, 12};
        System.out.println(binarySearch(a, 9));
        System.out.println(binarySearch(a, 2));
    }
}

// Output:
// 4
// -1
