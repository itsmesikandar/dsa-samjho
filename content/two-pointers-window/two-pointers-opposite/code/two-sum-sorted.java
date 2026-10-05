import java.util.Arrays;

class Main {
    // Two Sum II: sorted array, answer 1-indexed. Template: dono kinaron se, sum dekh ke pointer hilao
    static int[] twoSumSorted(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return new int[]{l + 1, r + 1}; // question 1-indexed maangta hai
            if (s < target) l++; // chhota sum: badi value chahiye
            else r--; // bada sum: chhoti value chahiye
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSumSorted(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(Arrays.toString(twoSumSorted(new int[]{-1, 0}, -1)));
    }
}

// Output:
// [1, 2]
// [1, 2]
