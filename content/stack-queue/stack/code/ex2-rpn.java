import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // Reverse Polish Notation: operator apne do numbers ke BAAD aata hai. "2 1 + 3 *" = (2 + 1) * 3
    static int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+", "-", "*", "/" -> {
                    int b = st.pop(); // pehle nikla = DOOSRA operand (order dhyaan se) //@op
                    int a = st.pop();
                    st.push(switch (t) {
                        case "+" -> a + b;
                        case "-" -> a - b;
                        case "*" -> a * b;
                        default -> a / b; // zero ki taraf truncate (Kotlin/Java default)
                    });
                }
                default -> st.push(Integer.parseInt(t)); // number: stack par //@num
            }
        }
        return st.peek(); //@result
    }

    public static void main(String[] args) {
        System.out.println(evalRPN(new String[]{"2", "1", "+", "3", "*"}));
        System.out.println(evalRPN(new String[]{"4", "13", "5", "/", "+"}));
        System.out.println(evalRPN(new String[]{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}));
    }
}

// Output:
// 9
// 6
// 22
