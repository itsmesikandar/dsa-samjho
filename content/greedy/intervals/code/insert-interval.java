import java.util.ArrayList;
import java.util.List;

class Main {
    // Sorted, bina collision wali list mein naya interval: 3 hisse - pehle wale, collide hone wale (milao), baad wale
    static List<List<Integer>> insert(int[][] intervals, int[] newInterval) {
        List<List<Integer>> out = new ArrayList<>();
        int s = newInterval[0], e = newInterval[1];
        int i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < s) { // naye se pehle khatam - jaise hai
            out.add(List.of(intervals[i][0], intervals[i][1]));
            i++;
        }
        while (i < n && intervals[i][0] <= e) { // naye se collide karta hai - milao
            s = Math.min(s, intervals[i][0]);
            e = Math.max(e, intervals[i][1]);
            i++;
        }
        out.add(List.of(s, e));
        while (i < n) { // baad wale - jaise hai
            out.add(List.of(intervals[i][0], intervals[i][1]));
            i++;
        }
        return out;
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2}, {4, 6}, {8, 10}, {12, 13}};
        System.out.println(insert(a, new int[] {5, 9}));
        System.out.println(insert(new int[][] {}, new int[] {3, 4}));
    }
}

// Output:
// [[1, 2], [4, 10], [12, 13]]
// [[3, 4]]
