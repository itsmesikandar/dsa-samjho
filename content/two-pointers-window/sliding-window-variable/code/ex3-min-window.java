class Main {
    // s ka sabse chhota substring jismein t ke saare characters (count ke saath) hon
    static String minWindow(String s, String t) {
        int[] need = new int[128]; // har char ki kitni zaroorat baaki (negative = window mein extra)
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(); // abhi kitne chars kam hain (count ke saath) //@init
        int l = 0;
        int bestL = 0;
        int bestLen = Integer.MAX_VALUE;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)] > 0) missing--; // ye char kaam ka tha //@expand
            need[s.charAt(r)]--; // window ne le liya
            while (missing == 0) { // saare mil gaye: window valid //@check
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; } //@update
                need[s.charAt(l)]++; // s[l] wapas do //@shrink
                if (need[s.charAt(l)] > 0) missing++; // zaroori char nikal gaya: window ab invalid
                l++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC"));
        System.out.println(minWindow("aa", "aa"));
        System.out.println(minWindow("a", "aa").isEmpty()); // t ke liye s mein 'a' kam hain
    }
}

// Output:
// BANC
// aa
// true
