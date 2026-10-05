import java.util.*;

class Main {
    // s ke har char ko t ke ek char se badal sakte ho (ek-se-ek, dono taraf)?
    static boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return false;
        Map<Character, Character> st = new HashMap<>(); // s ka char -> t ka char //@init
        Map<Character, Character> ts = new HashMap<>(); // t ka char -> s ka char (ulta rishta)
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            Character p = st.putIfAbsent(a, b); // pehle se kuch juda tha? (null = nahi)
            if (p != null && p.charValue() != b) return false; // a pehle kisi AUR se juda tha //@st
            Character q = ts.putIfAbsent(b, a);
            if (q != null && q.charValue() != a) return false; // b pehle kisi AUR se juda tha //@ts
        }
        return true; //@done
    }

    public static void main(String[] args) {
        System.out.println(isIsomorphic("egg", "add"));
        System.out.println(isIsomorphic("foo", "bar"));
        System.out.println(isIsomorphic("badc", "baba")); // ek taraf theek, ulti taraf fail
    }
}

// Output:
// true
// false
// false
