import java.util.Arrays;

class Main {
    // Neeche se upar: har parent ko sift down. Leaves pehle se heap hain
    static void buildHeap(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) siftDown(a, i); // aakhri parent se root tak //@loop
    }

    static void siftDown(int[] a, int i) {
        while (true) {
            int l = 2 * i + 1, r = l + 1, m = i;
            if (l < a.length && a[l] < a[m]) m = l;
            if (r < a.length && a[r] < a[m]) m = r;
            if (m == i) return; // bachche bade ya leaf - yahin theek //@stop
            int t = a[i]; // chhota bachcha upar, ye neeche //@down
            a[i] = a[m];
            a[m] = t;
            i = m;
        }
    }

    public static void main(String[] args) {
        int[] a = {9, 4, 7, 1, 8, 2, 3};
        buildHeap(a);
        System.out.println(Arrays.toString(a));
        int[] b = {5, 4, 3, 2, 1};
        buildHeap(b);
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [1, 4, 2, 9, 8, 7, 3]
// [1, 2, 3, 5, 4]
