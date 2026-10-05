import java.util.Arrays;

class Main {
    // Saare jodo (i < j) ki doori |a[i] - a[j]| ko sort karo to k-th sabse chhoti doori?
    static int smallestDistancePair(int[] nums, int k) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int lo = 0;
        int hi = a[a.length - 1] - a[0]; // doori isse zyada ho hi nahi sakti //@init
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2; //@mid
            if (countPairs(a, mid) >= k) hi = mid; // doori <= mid wale jode k ya zyada: answer <= mid //@ok
            else lo = mid + 1; //@notok
        }
        return lo; //@done
    }

    // Kitne jodo ki doori <= d? Sorted array par two pointers - O(n)
    static int countPairs(int[] a, int d) {
        int count = 0, l = 0;
        for (int r = 0; r < a.length; r++) {
            while (a[r] - a[l] > d) l++; // l ko itna aage lao ki a[r] - a[l] <= d
            count += r - l; // r ke saath l..r-1 sab jode chalenge //@count
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(smallestDistancePair(new int[]{1, 3, 4, 8, 10}, 4));
        System.out.println(smallestDistancePair(new int[]{1, 3, 1}, 1));
        System.out.println(smallestDistancePair(new int[]{1, 6, 1}, 3));
    }
}

// Output:
// 3
// 0
// 5
