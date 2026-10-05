import java.util.Arrays;

class Main {
    // Quick sort: pivot chuno, chhote left / bade right (partition), phir dono taraf recursion
    static void quickSort(int[] a, int l, int r) {
        if (l >= r) return; // 0 ya 1 item //@base
        int p = partition(a, l, r);
        quickSort(a, l, p - 1); // pivot apni pakki jagah par - use chhod ke dono taraf
        quickSort(a, p + 1, r);
    }

    // Lomuto partition. Pivot = beech wala item (sorted input par bhi theek), use end par rakh ke kaam
    static int partition(int[] a, int l, int r) {
        swap(a, (l + r) / 2, r); //@pivot
        int pivot = a[r];
        int s = l; // a[l .. s-1] sab pivot se chhote
        for (int i = l; i < r; i++) {
            if (a[i] < pivot) { // chhota mila: chhoton wale hisse mein daalo //@check
                swap(a, i, s); //@swap
                s++;
            }
        }
        swap(a, s, r); // pivot chhoton ke theek baad - yahi uski pakki jagah //@place
        return s;
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        int[] a = {10, 80, 30, 90, 40, 50, 70};
        quickSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [10, 30, 40, 50, 70, 80, 90]
