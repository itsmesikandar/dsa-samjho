import java.util.ArrayList;
import java.util.List;

class Main {
    static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    // Purane phone ka keypad: har digit (2-9) ke kuch letters. Digits ke saare possible letter combinations.
    static List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits.isEmpty()) return res;
        bt(digits, 0, new StringBuilder(), res);
        return res;
    }

    static void bt(String digits, int i, StringBuilder sb, List<String> res) {
        if (i == digits.length()) { // har digit ka ek letter chun liya //@found
            res.add(sb.toString());
            return;
        }
        for (char ch : KEYS[digits.charAt(i) - '0'].toCharArray()) { // is digit ke har letter ka ek raasta
            sb.append(ch); //@choose
            bt(digits, i + 1, sb, res);
            sb.deleteCharAt(sb.length() - 1); //@unchoose
        }
    }

    public static void main(String[] args) {
        System.out.println(letterCombinations("23"));
        System.out.println(letterCombinations(""));
    }
}

// Output:
// [ad, ae, af, bd, be, bf, cd, ce, cf]
// []
