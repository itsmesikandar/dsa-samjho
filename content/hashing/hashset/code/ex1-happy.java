import java.util.*;

class Main {
    // Har digit ka square jodo
    static int digitSquareSum(int n) {
        int s = 0, x = n;
        while (x > 0) {
            int d = x % 10;
            s += d * d;
            x /= 10;
        }
        return s;
    }

    // Baar-baar digitSquareSum karo: 1 aa gaya = happy. Koi number DOBARA aaya = chakkar, kabhi 1 nahi aayega.
    static boolean isHappy(int n) {
        Set<Integer> seen = new HashSet<>();
        int x = n;
        while (x != 1) {
            if (!seen.add(x)) return false; // ye number pehle aa chuka -> loop mein phas gaye //@cycle
            x = digitSquareSum(x); //@next
        }
        return true; //@happy
    }

    public static void main(String[] args) {
        System.out.println(isHappy(19)); // 19 -> 82 -> 68 -> 100 -> 1
        System.out.println(isHappy(2));
    }
}

// Output:
// true
// false
