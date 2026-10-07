import java.util.Arrays;

class Main {
    // Sorted array (negative bhi) ke squares, sorted order mein - O(n)
    static int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int l = 0; //@init
        int r = n - 1;
        for (int k = n - 1; k >= 0; k--) { // sabse bada square kisi ek EDGE par hoga -> res ko peeche se bharo
            if (Math.abs(nums[l]) > Math.abs(nums[r])) { // kaunse edge ka square bada? //@compare
                res[k] = nums[l] * nums[l]; //@left
                l++;
            } else {
                res[k] = nums[r] * nums[r]; //@right
                r--;
            }
        }
        return res; //@done
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(sortedSquares(new int[]{-4, -1, 0, 3, 10})));
        System.out.println(Arrays.toString(sortedSquares(new int[]{-7, -3, 2, 3, 11})));
    }
}

// Output:
// [0, 1, 9, 16, 100]
// [4, 9, 9, 49, 121]
