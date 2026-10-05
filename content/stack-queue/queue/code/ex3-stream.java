import java.util.ArrayDeque;
import java.util.Queue;

class Main {
    // Stream mein har naya char aane ke baad: ab tak ka PEHLA char jo sirf ek baar aaya hai? Na ho to '#'
    static String firstNonRepeating(String stream) {
        int[] count = new int[26];
        Queue<Character> q = new ArrayDeque<>(); // candidates, aane ke order mein
        StringBuilder out = new StringBuilder();
        for (char c : stream.toCharArray()) {
            count[c - 'a']++; //@count
            q.offer(c);
            while (!q.isEmpty() && count[q.peek() - 'a'] > 1) q.poll(); // aage wala repeat ho chuka: ab kabhi kaam ka nahi //@drop
            out.append(q.isEmpty() ? '#' : q.peek()); //@answer
        }
        return out.toString();
    }

    public static void main(String[] args) {
        System.out.println(firstNonRepeating("aabc"));
        System.out.println(firstNonRepeating("zz"));
    }
}

// Output:
// a#bb
// z#
