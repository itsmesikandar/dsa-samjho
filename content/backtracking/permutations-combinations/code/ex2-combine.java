import java.util.ArrayList;
import java.util.List;

class Main {
    // 1..n mein se k numbers ke saare combinations (order matter nahi karta)
    static List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        bt(n, k, 1, new ArrayList<>(), res);
        return res;
    }

    static void bt(int n, int k, int start, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == k) { //@found
            res.add(new ArrayList<>(path));
            return;
        }
        int need = k - path.size(); // abhi kitne aur chahiye
        for (int i = start; i <= n - need + 1; i++) { // isse bade se shuru kiya to aage kaafi numbers hi nahi bachenge (pruning) //@prune
            path.add(i); //@choose
            bt(n, k, i + 1, path, res); // sirf aage ke numbers: [1, 2] bana to [2, 1] kabhi nahi
            path.remove(path.size() - 1); //@unchoose
        }
    }

    public static void main(String[] args) {
        System.out.println(combine(4, 2));
        System.out.println(combine(1, 1));
    }
}

// Output:
// [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
// [[1]]
