import java.util.Arrays;

class Main {
    // Bottom-up merge sort: recursion nahi. Pehle 1-1 size ke pieces jodo, phir 2-2, phir 4-4 ...
    static void mergeSortBottomUp(int[] a) {
        int n = a.length;
        int[] tmp = new int[n];
        for (int width = 1; width < n; width *= 2) {
            for (int l = 0; l < n - width; l += 2 * width) { // right wala piece ho tabhi merge
                int mid = l + width - 1;
                int r = Math.min(l + 2 * width - 1, n - 1); // aakhri piece chhota ho sakta hai
                merge(a, l, mid, r, tmp);
            }
        }
    }

    static void merge(int[] a, int l, int mid, int r, int[] tmp) {
        int i = l, j = mid + 1, k = l;
        while (i <= mid && j <= r) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= r) tmp[k++] = a[j++];
        for (int p = l; p <= r; p++) a[p] = tmp[p];
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 6, 1, 4, 3, 7};
        mergeSortBottomUp(a);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [1, 2, 3, 4, 5, 6, 7]
