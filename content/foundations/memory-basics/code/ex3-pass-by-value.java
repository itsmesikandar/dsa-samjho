import java.util.Arrays;

class Main {
    static void tryChange(int num, int[] arr) {
        int x = num; // num ki local copy //@local
        x = 100; // sirf is frame ka local dabba badla //@x
        arr[0] = 100; // heap wala ASLI array badla //@arr
    }

    public static void main(String[] args) {
        int num = 5;
        int[] arr = {5, 6};
        tryChange(num, arr); // num ki value aur arr ka address copy hokar gaye //@call
        System.out.println(num); // 5 hi rahega //@print
        System.out.println(Arrays.toString(arr)); // [100, 6]
    }
}

// Output:
// 5
// [100, 6]
