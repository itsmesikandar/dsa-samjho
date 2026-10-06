import java.util.PriorityQueue;

class Main {
    // Har baar do sabse chhoti rassiyan jodo: jaldi judi rassi ki lambai aage baar baar ginti hai
    static long minCost(int[] ropes) {
        PriorityQueue<Long> pq = new PriorityQueue<>(); // min-heap; Long - kharcha bada ho sakta hai //@build
        for (int r : ropes) pq.add((long) r);
        long cost = 0;
        while (pq.size() > 1) {
            long s = pq.poll() + pq.poll(); // do sabse chhoti jodo; kharcha = dono ki lambai //@join
            cost += s;
            pq.add(s); // nayi rassi wapas - aage ye bhi judegi //@push
        }
        return cost; //@end
    }

    public static void main(String[] args) {
        System.out.println(minCost(new int[] {4, 3, 2, 6}));
        System.out.println(minCost(new int[] {1, 2, 3, 4, 5}));
        System.out.println(minCost(new int[] {10}));
    }
}

// Output:
// 29
// 33
// 0
