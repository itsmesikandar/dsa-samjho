import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // Alag-alag candidates; har number kitni bhi baar le sakte ho. Jinka sum = target, wo saare combinations.
    static List<List<Integer>> combinationSum(int[] cand, int target) {
        int[] c = cand.clone();
        Arrays.sort(c); // sorted: koi number bacha hua target se bada to aage wale bhi bade - loop tod do
        List<List<Integer>> res = new ArrayList<>();
        bt(c, 0, target, new ArrayList<>(), res);
        return res;
    }

    static void bt(int[] c, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { // target pura: ek combination mila //@found
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < c.length; i++) {
            if (c[i] > remain) break; // is branch ke aage sab bekaar - kaat do (pruning) //@prune
            path.add(c[i]); //@choose
            bt(c, i, remain - c[i], path, res); // i se hi: same number dobara le sakte; i se pehle nahi (warna [2,3] aur [3,2] dono)
            path.remove(path.size() - 1); //@unchoose
        }
    }

    public static void main(String[] args) {
        System.out.println(combinationSum(new int[]{2, 3, 6, 7}, 7));
        System.out.println(combinationSum(new int[]{2, 3, 5}, 8));
    }
}

// Output:
// [[2, 2, 3], [7]]
// [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
