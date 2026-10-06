import java.util.Arrays;
import java.util.Comparator;

class Main {
    // Saari meetings attend kar sakte ho? Start se sort - takraav hoga to sirf PADOSI meetings mein
    static boolean canAttendAll(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(iv -> iv[0])); //@sort
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i - 1][1]) return false; // pichhli khatam hone se pehle agli shuru //@clash
        }
        return true; // 10 baje khatam, 10 baje shuru - chalega //@done
    }

    public static void main(String[] args) {
        System.out.println(canAttendAll(new int[][] {{13, 15}, {9, 10}, {10, 12}}));
        System.out.println(canAttendAll(new int[][] {{9, 11}, {14, 15}, {10, 12}}));
        System.out.println(canAttendAll(new int[][] {}));
    }
}

// Output:
// true
// false
// true
