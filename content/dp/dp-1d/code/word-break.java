import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Main {
    // dp[i] = s ke pehle i characters dictionary ke words mein poore toot sakte hain?
    static boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true; // khaali string - toot gayi (kuch nahi bacha)
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && words.contains(s.substring(j, i))) { // pehle j theek + aakhri tukda s[j..i) ek word
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }

    public static void main(String[] args) {
        System.out.println(wordBreak("chaipani", List.of("chai", "pani", "pa", "ni")));
        System.out.println(wordBreak("chaipaniya", List.of("chai", "pani")));
    }
}

// Output:
// true
// false
