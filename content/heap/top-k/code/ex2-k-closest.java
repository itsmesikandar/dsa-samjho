import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    static int dist(int[] p) {
        return p[0] * p[0] + p[1] * p[1]; // sqrt ki zaroorat nahi - order same
    }

    // k sabse paas: distance par MAX-heap, size k. Sabse door wala root par - wahi bahar jaayega
    static List<List<Integer>> kClosest(int[][] points, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(dist(b), dist(a))); //@init
        for (int[] p : points) {
            pq.add(p); //@add
            if (pq.size() > k) pq.poll(); // sabse door wala bahar //@trim
        }
        // jawab kisi bhi order mein chalega; yahan paas se door (tie par x, y) taaki output pakka ho
        List<int[]> left = new ArrayList<>(pq); //@ans
        left.sort(Comparator.<int[]>comparingInt(Main::dist).thenComparingInt(p -> p[0]).thenComparingInt(p -> p[1]));
        List<List<Integer>> out = new ArrayList<>();
        for (int[] p : left) out.add(List.of(p[0], p[1]));
        return out;
    }

    public static void main(String[] args) {
        int[][] pts = {{1, 3}, {-2, 2}, {5, -1}, {0, 4}, {3, 3}};
        System.out.println(kClosest(pts, 2));
        System.out.println(kClosest(new int[][] {{3, 3}, {5, -1}, {-2, 4}}, 2));
    }
}

// Output:
// [[-2, 2], [1, 3]]
// [[3, 3], [-2, 4]]
