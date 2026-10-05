import java.util.ArrayList;
import java.util.List;

class Main {
    // Permutations bina used[] aur bina path ke: array ke andar hi swap karke
    static List<List<Integer>> permuteSwap(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        go(nums.clone(), 0, res);
        return res;
    }

    static void go(int[] a, int k, List<List<Integer>> res) { // position k par kaun baithega? k..n-1 mein se har ek ko yahan laake try karo
        if (k == a.length) {
            List<Integer> p = new ArrayList<>();
            for (int x : a) p.add(x);
            res.add(p);
            return;
        }
        for (int i = k; i < a.length; i++) {
            swap(a, k, i); // i wala k par aaya
            go(a, k + 1, res);
            swap(a, k, i); // wapas jaisa tha (backtrack)
        }
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        System.out.println(permuteSwap(new int[]{1, 2, 3}));
    }
}

// Output:
// [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 2, 1], [3, 1, 2]]
