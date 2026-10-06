import java.util.Arrays;

class Main {
    // In-place heap sort: pehle max-heap, phir root (sabse bada) ko end par bhejte jao
    static void heapSort(int[] a) {
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, i, n); // O(n) mein max-heap //@build
        for (int end = n - 1; end >= 1; end--) {
            swap(a, 0, end); // sabse bada apni pakki jagah (end) par //@swap
            siftDown(a, 0, end); // heap ab sirf 0 until end; naya root theek karo //@fix
        }
    }

    static void siftDown(int[] a, int i, int n) {
        while (true) {
            int l = 2 * i + 1, r = l + 1, m = i;
            if (l < n && a[l] > a[m]) m = l; // max-heap: bada bachcha upar aayega
            if (r < n && a[r] > a[m]) m = r;
            if (m == i) return;
            swap(a, i, m); //@down
            i = m;
        }
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 6, 3};
        heapSort(a);
        System.out.println(Arrays.toString(a));
        int[] b = {3, 1, 2, 3, 1};
        heapSort(b);
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [1, 2, 3, 5, 6, 9]
// [1, 1, 2, 3, 3]
