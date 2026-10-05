import java.util.HashMap;
import java.util.Map;

class Main {
    // n seedhiyan, ek baar mein 1 ya 2 chadh sakte ho. Upar pahunchne ke kitne tareeke?
    static int climbStairs(int n) {
        return ways(n, new HashMap<>());
    }

    static int ways(int n, Map<Integer, Integer> memo) {
        if (n <= 1) return 1; // 0 ya 1 seedhi: ek hi tareeka //@base
        Integer cached = memo.get(n); // pehle nikaal chuke? seedha wahi do //@memo
        if (cached != null) return cached;
        int r = ways(n - 1, memo) + ways(n - 2, memo); // aakhri kadam 1 tha ya 2 //@calc
        memo.put(n, r); // yaad rakho, dobara kaam aayega //@save
        return r;
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(5));
        System.out.println(climbStairs(45)); // bina memo ke ye minute lagata; memo se turant
    }
}

// Output:
// 8
// 1836311903
