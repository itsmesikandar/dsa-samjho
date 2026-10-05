import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // "3[a2[c]]" -> "accaccacc". k[...] matlab andar wala string k baar.
    static String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>(); // har khule bracket ka k
        Deque<StringBuilder> outs = new ArrayDeque<>(); // bracket khulne se PEHLE tak bana hua string
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                k = k * 10 + (c - '0'); // number kai digits ka ho sakta hai (12[a]) //@digit
            } else if (c == '[') { // naya level: abhi tak ka kaam stack par save //@open
                counts.push(k);
                outs.push(cur);
                cur = new StringBuilder();
                k = 0;
            } else if (c == ']') { // level khatam: andar wala times baar, bahar wale ke saath jodo //@close
                int times = counts.pop();
                StringBuilder outer = outs.pop();
                String inner = cur.toString();
                for (int i = 0; i < times; i++) outer.append(inner);
                cur = outer;
            } else {
                cur.append(c); //@char
            }
        }
        return cur.toString();
    }

    public static void main(String[] args) {
        System.out.println(decodeString("3[a2[c]]"));
        System.out.println(decodeString("3[a]2[bc]"));
        System.out.println(decodeString("2[abc]3[cd]ef"));
    }
}

// Output:
// accaccacc
// aaabcbc
// abcabccdcdcdef
