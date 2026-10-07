import java.util.HashSet;
import java.util.Set;

class Main {
    // Sabse lamba substring jismein koi character repeat na ho
    static int lengthOfLongestSubstring(String s) {
        Set<Character> inWindow = new HashSet<>(); // window ke characters
        int l = 0;
        int best = 0;
        for (int r = 0; r < s.length(); r++) {
            while (inWindow.contains(s.charAt(r))) { // s[r] pehle se andar: purani copy nikalne tak shrink karo //@shrink
                inWindow.remove(s.charAt(l));
                l++;
            }
            inWindow.add(s.charAt(r)); //@expand
            best = Math.max(best, r - l + 1); //@update
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb"));
        System.out.println(lengthOfLongestSubstring("pwwkew"));
        System.out.println(lengthOfLongestSubstring(""));
    }
}

// Output:
// 3
// 3
// 0
