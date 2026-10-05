class Main {
    // k-th sabse bada number (sorted order ka k-th; distinct nahi). Quickselect: average O(n)
    static int findKthLargest(int[] nums, int k) {
        int target = nums.length - k; // badhte order mein ye index chahiye
        int l = 0, r = nums.length - 1;
        while (true) {
            int p = partition(nums, l, r); // pivot apni pakki jagah p par pahuncha //@part
            if (p == target) return nums[p]; //@found
            if (p < target) l = p + 1; // answer right mein: left wala hissa bhool jao //@right
            else r = p - 1; // answer left mein //@left
        }
    }

    // Quick sort wala Lomuto partition (beech wala pivot)
    static int partition(int[] a, int l, int r) {
        swap(a, (l + r) / 2, r);
        int pivot = a[r];
        int s = l;
        for (int i = l; i < r; i++) {
            if (a[i] < pivot) {
                swap(a, i, s);
                s++;
            }
        }
        swap(a, s, r);
        return s;
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));
        System.out.println(findKthLargest(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4));
    }
}

// Output:
// 5
// 4
