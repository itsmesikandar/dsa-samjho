import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    public static void main(String[] args) {
        Deque<Integer> st = new ArrayDeque<>(); // java.util.Stack purana aur synchronized (slow) - ArrayDeque lo
        st.push(10); // push: top par
        st.push(20);
        st.push(30);
        System.out.println(st.peek()); // peek: upar wala dekho, nikaalo mat
        System.out.println(st.pop()); // pop: upar wala nikaalo
        System.out.println(st.size());
        System.out.println(st.isEmpty() ? "khaali" : String.valueOf(st.peek())); // khaali par pop() exception, peek() null
    }
}

// Output:
// 30
// 30
// 2
// 20
