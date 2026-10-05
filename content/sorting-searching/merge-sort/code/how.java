import java.util.Arrays;

class Main {
    // Merge sort: aadha karo, dono halves ko sort karo (recursion), phir do sorted halves ko jodo (merge)
    static void mergeSort(int[] a, int l, int r, int[] tmp) {
        if (l >= r) return; // 0 ya 1 item: pehle se sorted //@base
        int mid = (l + r) / 2; //@split
        mergeSort(a, l, mid, tmp);
        mergeSort(a, mid + 1, r, tmp);
        merge(a, l, mid, r, tmp);
    }

    // a[l..mid] aur a[mid+1..r] dono sorted hain -> inhe ek sorted hissa banao
    static void merge(int[] a, int l, int mid, int r, int[] tmp) {
        int i = l, j = mid + 1, k = l;
        while (i <= mid && j <= r) {
            if (a[i] <= a[j]) tmp[k++] = a[i++]; // dono ke aage wale mein chhota lo; barabar par left = stable //@pick
            else tmp[k++] = a[j++];
        }
        while (i <= mid) tmp[k++] = a[i++]; // ek half khatam: doosre ke bache seedhe copy //@rest
        while (j <= r) tmp[k++] = a[j++];
        for (int p = l; p <= r; p++) a[p] = tmp[p]; // tmp se wapas a mein //@copy
    }

    public static void main(String[] args) {
        int[] a = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(a, 0, a.length - 1, new int[a.length]);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [3, 9, 10, 27, 38, 43, 82]
