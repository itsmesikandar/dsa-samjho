class Main {
    // Pivot index: jiske left ka sum == right ka sum. Sabse pehla do, na mile to -1.
    static int pivotIndex(int[] arr) {
        int total = 0;
        for (int x : arr) total += x; // poore array ka total //@total
        int left = 0; // i ke left wale items ka sum
        for (int i = 0; i < arr.length; i++) {
            int right = total - left - arr[i]; // baaki bacha = right ka sum //@check
            if (left == right) return i; //@found
            left += arr[i]; // agle i ke liye left badhao //@add
        }
        return -1; //@none
    }

    public static void main(String[] args) {
        System.out.println(pivotIndex(new int[]{1, 7, 3, 6, 5, 6}));
        System.out.println(pivotIndex(new int[]{1, 2, 3}));
        System.out.println(pivotIndex(new int[]{2, 1, -1})); // index 0: left khaali (0), right 1 + (-1) = 0
    }
}

// Output:
// 3
// -1
// 0
