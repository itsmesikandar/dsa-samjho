import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // s mein p ke saare anagrams kahan-kahan shuru hote hain (start indexes)
    static List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        int k = p.length();
        if (k > s.length()) return res;
        int[] need = new int[26]; // p ke har letter ki ginti
        int[] have = new int[26]; // window ke har letter ki ginti
        for (char c : p.toCharArray()) need[c - 'a']++; //@init
        for (int r = 0; r < s.length(); r++) {
            have[s.charAt(r) - 'a']++; // naya char window mein //@add
            if (r >= k) have[s.charAt(r - k) - 'a']--; // window k se badi: sabse purana bahar //@remove
            if (r >= k - 1 && Arrays.equals(have, need)) res.add(r - k + 1); // 26 counts same = anagram //@check
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(findAnagrams("cbaebabacd", "abc"));
        System.out.println(findAnagrams("abab", "ab"));
    }
}

// Output:
// [0, 6]
// [0, 1, 2]
