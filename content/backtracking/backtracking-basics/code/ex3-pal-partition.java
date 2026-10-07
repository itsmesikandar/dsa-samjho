import java.util.ArrayList;
import java.util.List;

class Main {
    // String ko pieces mein kaato ki HAR piece palindrome ho. Saare tareeke do.
    static List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        bt(s, 0, new ArrayList<>(), res);
        return res;
    }

    static boolean isPal(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return false;
            l++;
            r--;
        }
        return true;
    }

    static void bt(String s, int start, List<String> path, List<List<String>> res) {
        if (start == s.length()) { // poora string kat gaya: ek tareeka mila //@found
            res.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) { // agla piece s[start..end] - har length try
            if (!isPal(s, start, end)) continue; // palindrome nahi: is raaste jaana hi bekaar //@prune
            path.add(s.substring(start, end + 1)); //@choose
            bt(s, end + 1, path, res); // baaki string ko kaato
            path.remove(path.size() - 1); //@unchoose
        }
    }

    public static void main(String[] args) {
        System.out.println(partition("aab"));
        System.out.println(partition("a"));
    }
}

// Output:
// [[a, a, b], [aa, b]]
// [[a]]
