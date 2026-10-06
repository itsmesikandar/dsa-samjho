import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

class Main {
    // Merge intervals: start se sort, phir ek pass - har interval ya to pichhle mein ghul jaata hai ya naya shuru
    static int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(iv -> iv[0])); // start se sort - takraane wale paas paas aa jaate hain //@sort
        List<int[]> out = new ArrayList<>();
        for (int[] cur : intervals) {
            int[] last = out.isEmpty() ? null : out.get(out.size() - 1);
            if (last == null || cur[0] > last[1]) {
                out.add(new int[] {cur[0], cur[1]}); // pichhle ke khatam hone ke baad shuru - naya interval //@new
            } else {
                last[1] = Math.max(last[1], cur[1]); // takraaya - pichhle ko aage tak khiincho //@extend
            }
        }
        return out.toArray(new int[0][]); //@done
    }

    public static void main(String[] args) {
        int[][] a = {{6, 8}, {1, 3}, {2, 4}, {9, 10}, {8, 9}, {11, 12}};
        System.out.println(Arrays.deepToString(merge(a)));
        System.out.println(Arrays.deepToString(merge(new int[][] {{1, 10}, {2, 3}, {4, 5}})));
    }
}

// Output:
// [[1, 4], [6, 10], [11, 12]]
// [[1, 10]]
