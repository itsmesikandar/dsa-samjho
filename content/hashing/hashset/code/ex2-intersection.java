import java.util.*;

class Main {
    // Dono arrays mein common numbers (har ek sirf ek baar), sorted
    static int[] intersection(int[] a, int[] b) {
        Set<Integer> setA = new HashSet<>(); //@build
        for (int x : a) setA.add(x); // a ke numbers yaad rakho, O(1) check ke liye
        Set<Integer> res = new TreeSet<>(); // result set - duplicate apne aap hatenge (TreeSet = sorted)
        for (int x : b) {
            if (setA.contains(x)) res.add(x); // b ka x a mein bhi hai? //@check
        }
        int[] out = new int[res.size()]; //@done
        int i = 0;
        for (int x : res) out[i++] = x;
        return out;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(intersection(new int[]{4, 9, 5}, new int[]{9, 4, 9, 8, 4})));
        System.out.println(Arrays.toString(intersection(new int[]{1, 2, 2, 1}, new int[]{2, 2})));
    }
}

// Output:
// [4, 9]
// [2]
