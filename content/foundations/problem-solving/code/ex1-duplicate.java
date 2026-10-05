import java.util.Arrays;
import java.util.HashSet;

class Main {
    // Teen approaches, ek hi sawaal: kya koi number do baar hai?

    // 3) HashSet: O(n) time, O(n) space (final choice jab n bada ho)
    static boolean hasDupSet(int[] arr) {
        HashSet<Integer> seen = new HashSet<>(); //@init
        for (int x : arr) {
            if (seen.contains(x)) return true; // pehle dekha hua! //@hit
            seen.add(x); // yaad rakho //@add
        }
        return false; //@none
    }

    // 1) Brute force: O(n^2) time, O(1) space
    static boolean hasDupBrute(int[] arr) {
        for (int i = 0; i < arr.length; i++)
            for (int j = i + 1; j < arr.length; j++)
                if (arr[i] == arr[j]) return true;
        return false;
    }

    // 2) Sort + padosi check: O(n log n) time (copy banayi, isliye O(n) space)
    static boolean hasDupSort(int[] arr) {
        int[] s = arr.clone();
        Arrays.sort(s);
        for (int i = 1; i < s.length; i++) if (s[i] == s[i - 1]) return true;
        return false;
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5};
        System.out.println(hasDupSet(a));
        System.out.println(hasDupBrute(a));
        System.out.println(hasDupSort(a));
        System.out.println(hasDupSet(new int[]{2, 7, 9}));
    }
}

// Output:
// true
// true
// true
// false
