class Main {
    // Inversions count karo: i < j aur a[i] > a[j]. Merge sort ke merge mein O(n log n)
    static long countInversions(int[] arr) {
        return sortCount(arr.clone(), 0, arr.length - 1, new int[arr.length]);
    }

    static long sortCount(int[] a, int l, int r, int[] tmp) {
        if (l >= r) return 0; //@base
        int mid = (l + r) / 2;
        long count = sortCount(a, l, mid, tmp) + sortCount(a, mid + 1, r, tmp); // dono halves ke andar wale //@halves
        int i = l, j = mid + 1, k = l;
        while (i <= mid && j <= r) {
            if (a[i] <= a[j]) {
                tmp[k++] = a[i++]; //@left
            } else {
                count += mid - i + 1; // a[j] left ke BACHE HUE saare items se chhota hai //@cross
                tmp[k++] = a[j++];
            }
        }
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= r) tmp[k++] = a[j++];
        for (int p = l; p <= r; p++) a[p] = tmp[p];
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countInversions(new int[]{2, 4, 1, 3, 5}));
        System.out.println(countInversions(new int[]{5, 4, 3, 2, 1}));
    }
}

// Output:
// 3
// 10
