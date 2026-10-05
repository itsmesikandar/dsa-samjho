import java.util.HashSet;

class Main {
    // Sawaal: array mein koi number do baar hai? Do tareeke.

    // 1) O(n^2) time, O(1) extra space: har pair compare
    static boolean hasDupSlow(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) return true;
            }
        }
        return false;
    }

    // 2) O(n) time, O(n) extra space: HashSet "yaad" rakhta hai kya dekh liya
    static boolean hasDupFast(int[] arr) {
        HashSet<Integer> seen = new HashSet<>();
        for (int x : arr) {
            if (!seen.add(x)) return true; // add() false deta hai agar pehle se tha
        }
        return false;
    }

    public static void main(String[] args) {
        int[] a = {4, 7, 1, 7};
        System.out.println(hasDupSlow(a));
        System.out.println(hasDupFast(a));
        int[] b = {1, 2, 3};
        System.out.println(hasDupSlow(b));
        System.out.println(hasDupFast(b));
    }
}

// Output:
// true
// true
// false
// false
