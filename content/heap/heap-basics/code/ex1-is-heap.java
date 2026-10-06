class Main {
    // Min-heap check: har parent apne bachchon se chhota ya barabar
    static boolean isMinHeap(int[] a) {
        for (int i = 0; i < a.length / 2; i++) { // sirf parents; index n/2 se aage sab leaves //@loop
            int l = 2 * i + 1, r = l + 1;
            if (a[l] < a[i] || (r < a.length && a[r] < a[i])) return false; // bachcha parent se chhota - toota //@check
        }
        return true; // koi parent bada nahi mila //@ok
    }

    public static void main(String[] args) {
        System.out.println(isMinHeap(new int[] {3, 5, 4, 9, 6, 8, 1}));
        System.out.println(isMinHeap(new int[] {1, 2, 3, 4, 5}));
        System.out.println(isMinHeap(new int[] {1, 5, 2, 6, 7, 3}));
        System.out.println(isMinHeap(new int[] {7}));
    }
}

// Output:
// false
// true
// true
// true
