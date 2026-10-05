class Main {
    // lowerBound: pehla a[i] >= x.  upperBound: pehla a[i] > x.  Dono ka fark = x kitni baar aaya.
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
            if (a[mid] > x) hi = mid; // sirf ye condition alag
            else lo = mid + 1;
        }
        return lo;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 4, 4, 4, 7, 9};
        System.out.println(upperBound(a, 4));
        System.out.println(upperBound(a, 4) - lowerBound(a, 4)); // 4 kitni baar
        System.out.println(lowerBound(a, 3) - 1); // aakhri index jahan a[i] < 3
    }
}

// Output:
// 5
// 3
// 1
