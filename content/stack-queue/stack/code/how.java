import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

class Main {
    // Brackets sahi khule-band hain? "([]{})" sahi, "(]" galat, "([)]" galat
    static boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>(); // khule brackets jo abhi band nahi hue
        Map<Character, Character> pair = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (!pair.containsKey(c)) { // khulne wala: stack par rakho //@push
                st.push(c);
            } else if (st.isEmpty() || st.pop() != pair.get(c).charValue()) { // band wala SABSE FRESH khule se match hona chahiye //@match
                return false;
            }
        }
        return st.isEmpty(); // koi khula reh gaya to galat //@end
    }

    public static void main(String[] args) {
        System.out.println(isValid("([]{})"));
        System.out.println(isValid("([)]"));
        System.out.println(isValid("(("));
    }
}

// Output:
// true
// false
// false
