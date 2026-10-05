import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // Har insaan [height, k]: k = mere AAGE kitne log hain jinki height >= meri. Line dobara banao.
    static List<int[]> reconstructQueue(int[][] people) {
        int[][] sorted = people.clone();
        // lambe log pehle; same height par chhota k pehle
        Arrays.sort(sorted, (a, b) -> a[0] != b[0] ? Integer.compare(b[0], a[0]) : Integer.compare(a[1], b[1])); //@sort
        List<int[]> line = new ArrayList<>();
        for (int[] p : sorted) {
            // ab tak line mein sab mujhse lambe (ya barabar) hain -> mujhe thik index k par ghusna hai
            line.add(p[1], p); //@insert
        }
        return line;
    }

    public static void main(String[] args) {
        int[][] people = {{7, 0}, {4, 4}, {7, 1}, {5, 0}, {6, 1}, {5, 2}};
        List<String> parts = new ArrayList<>();
        for (int[] p : reconstructQueue(people)) parts.add(Arrays.toString(p));
        System.out.println(String.join(", ", parts));
    }
}

// Output:
// [5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]
