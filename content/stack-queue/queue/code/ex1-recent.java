import java.util.ArrayDeque;
import java.util.Queue;

class Main {
    // ping(t): t time par call aayi. Pichhle 3000 ms (t - 3000 se t tak) mein kitni calls? (t badhta hi hai)
    static class RecentCounter {
        private final Queue<Integer> q = new ArrayDeque<>();

        int ping(int t) {
            q.offer(t); // nayi call peeche //@add
            while (q.peek() < t - 3000) q.poll(); // window se bahar wali purani calls aage se hatao //@drop
            return q.size(); //@count
        }
    }

    public static void main(String[] args) {
        RecentCounter rc = new RecentCounter();
        System.out.println(rc.ping(1));
        System.out.println(rc.ping(100));
        System.out.println(rc.ping(3001));
        System.out.println(rc.ping(3002));
    }
}

// Output:
// 1
// 2
// 3
// 3
