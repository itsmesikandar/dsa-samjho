import java.util.Arrays;

class Main {
    // Hoare-style partition: do pointers dono kinaron se, galat taraf wale items ka jodi swap.
    // Lomuto se kam swaps, aur sab barabar items par bhi beech se todta hai.
    static void quickSortHoare(int[] a, int l, int r) {
        if (l >= r) return;
        int pivot = a[(l + r) / 2];
        int i = l, j = r;
        while (i <= j) {
            while (a[i] < pivot) i++; // left mein jo pehle se sahi taraf hain, chhodo
            while (a[j] > pivot) j--;
            if (i <= j) { // dono galat taraf: swap
                int t = a[i];
                a[i] = a[j];
                a[j] = t;
                i++;
                j--;
            }
        }
        quickSortHoare(a, l, j); // ab a[l..j] <= pivot <= a[i..r]
        quickSortHoare(a, i, r);
    }

    public static void main(String[] args) {
        int[] a = {5, 3, 8, 3, 9, 1, 3, 7};
        quickSortHoare(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
        int[] same = {4, 4, 4, 4, 4, 4}; // sab barabar: phir bhi beech se toot-ta hai, O(n log n)
        quickSortHoare(same, 0, same.length - 1);
        System.out.println(Arrays.toString(same));
    }
}

// Output:
// [1, 3, 3, 3, 5, 7, 8, 9]
// [4, 4, 4, 4, 4, 4]
