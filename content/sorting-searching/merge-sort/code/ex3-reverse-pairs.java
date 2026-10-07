class Main {
    // Kitne jode (i < j) hain jahan nums[i] > 2 * nums[j]?
    static int reversePairs(int[] nums) {
        return sortCount(nums.clone(), 0, nums.length - 1, new int[nums.length]);
    }

    static int sortCount(int[] a, int l, int r, int[] tmp) {
        if (l >= r) return 0; //@base
        int mid = (l + r) / 2;
        int count = sortCount(a, l, mid, tmp) + sortCount(a, mid + 1, r, tmp); //@halves
        // MERGE SE PEHLE alag count: dono halves sorted hain, to j kabhi peeche nahi jaata
        int j = mid + 1;
        for (int i = l; i <= mid; i++) {
            while (j <= r && (long) a[i] > 2L * a[j]) j++; // long: 2 * a[j] int mein overflow ho sakta hai //@count
            count += j - (mid + 1); // right ke a[mid+1 .. j-1] sab a[i] ke saath jode banate hain //@add
        }
        // ab normal merge
        int i = l, k = l;
        j = mid + 1;
        while (i <= mid && j <= r) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++]; //@merge
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= r) tmp[k++] = a[j++];
        for (int p = l; p <= r; p++) a[p] = tmp[p];
        return count;
    }

    public static void main(String[] args) {
        System.out.println(reversePairs(new int[]{2, 4, 3, 5, 1}));
        System.out.println(reversePairs(new int[]{1, 3, 2, 3, 1}));
        System.out.println(reversePairs(new int[]{1, 1073741824})); // 2 * 1073741824 int mein overflow: long zaroori
    }
}

// Output:
// 3
// 2
// 0
