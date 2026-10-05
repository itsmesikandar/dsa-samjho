class Main {
    // Pehla index jahan a[i] >= x (sab chhote hon to a.length). "Pehla TRUE" wala template.
    static int lowerBound(int[] a, int x) {
        int lo = 0;
        int hi = a.length; // answer [lo, hi] mein; hi = length matlab 'koi nahi mila' //@init
        while (lo < hi) { // lo == hi = ek hi candidate bacha = wahi answer
            int mid = lo + (hi - lo) / 2; //@mid
            if (a[mid] >= x) hi = mid; // mid khud answer ho sakta hai - use range mein rakho //@yes
            else lo = mid + 1; // mid aur uske left sab chhote - hatao //@no
        }
        return lo; //@done
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 4, 4, 4, 7, 9};
        System.out.println(lowerBound(a, 4));
        System.out.println(lowerBound(a, 5));
        System.out.println(lowerBound(a, 10));
    }
}

// Output:
// 2
// 5
// 7
