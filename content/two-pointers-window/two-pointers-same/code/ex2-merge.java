import java.util.Arrays;

class Main {
    // nums1 mein m numbers + end mein n khaali jagah. nums2 (n numbers) ko andar merge karo, sorted.
    static void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1; // nums1 ka aakhri asli number //@init
        int j = n - 1; // nums2 ka aakhri number
        int k = m + n - 1; // kahan likhna hai (peeche se)
        while (j >= 0) { // nums2 khatam = kaam khatam (nums1 ke bache pehle se sahi jagah par)
            if (i >= 0 && nums1[i] > nums2[j]) { // dono ke aakhri mein bada kaun? //@compare
                nums1[k] = nums1[i]; //@takeA
                i--;
            } else {
                nums1[k] = nums2[j]; //@takeB
                j--;
            }
            k--;
        }
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 0, 0, 0};
        merge(a, 3, new int[]{2, 5, 6}, 3);
        System.out.println(Arrays.toString(a));
        int[] b = {0};
        merge(b, 0, new int[]{1}, 1); // nums1 mein koi asli number nahi
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [1, 2, 2, 3, 5, 6]
// [1]
