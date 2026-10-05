import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        int[] a = {10, 20, 30, 40}; // sorted hona ZAROORI hai
        System.out.println(Arrays.binarySearch(a, 30)); // mila: index
        int r = Arrays.binarySearch(a, 25); // nahi mila: -(insertion point) - 1
        System.out.println(r);
        System.out.println(-(r + 1)); // insertion point: 25 ko kahan daalein ki sorted rahe
        List<Integer> list = List.of(1, 3, 5);
        System.out.println(Collections.binarySearch(list, 5)); // List par bhi
    }
}

// Output:
// 2
// -3
// 2
// 2
