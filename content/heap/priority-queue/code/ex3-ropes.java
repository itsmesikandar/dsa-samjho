import java.util.PriorityQueue;

class Main {
    // Har baar 2 sabse chhoti ropes jodo: jaldi judi rope ki length aage baar baar count hai
    static long minCost(int[] ropes) {
        PriorityQueue<Long> pq = new PriorityQueue<>(); // min-heap; Long - cost bada ho sakta hai //@build
        for (int r : ropes) pq.add((long) r);
        long cost = 0;
        while (pq.size() > 1) {
            long s = pq.poll() + pq.poll(); // 2 sabse chhoti jodo; cost = dono ki length //@join
            cost += s;
            pq.add(s); // nayi rope wapas - aage ye bhi judegi //@push
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
