import java.util.function.IntPredicate;

class Main {
    // "Sabse chhota x jo chal jaaye" - condition: feasible(x) monotonic ho (x chala to x+1 bhi chalega)
    static int minFeasible(int lo, int hi, IntPredicate feasible) {
        // hi pakka feasible hona chahiye
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (feasible.test(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }

    public static void main(String[] args) {
        // sabse chhota x jiska x * x * x >= 1000
        System.out.println(minFeasible(0, 1000, x -> (long) x * x * x >= 1000));
        // 12 chapters, 5 din: roz kam se kam kitne chapter padho?
        System.out.println(minFeasible(1, 12, perDay -> (12 - 1) / perDay + 1 <= 5));
    }
}

// Output:
// 10
// 3
