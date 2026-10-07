import java.util.Arrays;
import java.util.Comparator;

class Main {
    // Kam se kam hatao = zyada se zyada rakho. Jo JALDI khatam ho use rakho - baaki ke liye sabse zyada jagah bachti hai
    static int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(iv -> iv[1])); // end se sort (start se nahi!) //@sort
        int end = Integer.MIN_VALUE; // aakhri rakhe interval ka end
        int removed = 0;
        for (int[] iv : intervals) {
            if (iv[0] >= end) {
                end = iv[1]; // collide karta nahi - rakho //@keep
            } else {
                removed++; // collide karta hai - isi ko hatao (iska end pichhle se bada ya barabar) //@drop
            }
        }
        return removed; //@done
    }

    public static void main(String[] args) {
        System.out.println(eraseOverlapIntervals(new int[][] {{1, 4}, {2, 3}, {3, 6}, {5, 7}, {6, 8}}));
        System.out.println(eraseOverlapIntervals(new int[][] {{1, 2}, {1, 2}, {1, 2}}));
        System.out.println(eraseOverlapIntervals(new int[][] {{1, 2}, {2, 3}}));
    }
}

// Output:
// 2
// 2
// 0
