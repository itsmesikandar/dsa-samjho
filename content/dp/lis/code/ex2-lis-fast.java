class Main {
    // LIS O(n log n): tails[k] = (k + 1) length wali badhti chain ka SABSE CHHOTA aakhri element. tails hamesha sorted
    static int lengthOfLISFast(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0;
            int hi = size; // pehla tails[idx] >= x dhoondo (lower bound)
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x; // bada aakhri element hata ke chhota rakho - aage badhne ka zyada mauka //@place
            if (lo == size) size++; // x sab se bada tha - chain ek lambi //@grow
        }
        return size; //@done
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLISFast(new int[] {5, 2, 8, 6, 3, 6, 9, 7}));
        System.out.println(lengthOfLISFast(new int[] {3, 4, 1}));
    }
}

// Output:
// 4
// 2
