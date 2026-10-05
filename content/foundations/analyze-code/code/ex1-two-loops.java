import java.util.Arrays;

class Main {
    // Do alag arrays ka total sum: ek loop ke BAAD doosra loop
    static int sumBoth(int[] a, int[] b) {
        int s = 0;
        for (int x : a) s += x; // n baar //@loopA
        for (int y : b) s += y; // m baar //@loopB
        return s; // total n + m //@done
    }

    public static void main(String[] args) {
        System.out.println(sumBoth(new int[]{1, 2, 3}, new int[]{4, 5}));
        int[] big = new int[1000];
        int[] small = new int[10];
        Arrays.fill(big, 1);
        Arrays.fill(small, 1);
        System.out.println(sumBoth(big, small)); // 1000 + 10 kaam
    }
}

// Output:
// 15
// 1010
