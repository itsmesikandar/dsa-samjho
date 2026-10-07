import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    // Kharab keyboard: har char type hota hai, par 'i' dabate hi ab tak ka text ULTA ho jaata hai ('i' khud nahi likhta)
    static String finalString(String s) {
        Deque<Character> dq = new ArrayDeque<>();
        boolean flipped = false; // sach mein ulta karne (O(n)) ki jagah bas yaad rakho ki "ab ulta hai"
        for (char c : s.toCharArray()) {
            if (c == 'i') flipped = !flipped; //@flip
            else if (flipped) dq.offerFirst(c); // ulti state mein naya char asal mein AAGE judta hai //@front
            else dq.offerLast(c); //@back
        }
        StringBuilder out = new StringBuilder();
        for (char c : dq) out.append(c);
        return flipped ? out.reverse().toString() : out.toString(); // aakhir mein ek hi baar seedha karo //@done
    }

    public static void main(String[] args) {
        System.out.println(finalString("string"));
        System.out.println(finalString("poiinter"));
    }
}

// Output:
// rtsng
// ponter
