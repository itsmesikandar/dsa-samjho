import java.util.List;

class Main {
    // Triangle: upar se neeche, har row mein neeche ke do neighbors mein se ek. Neeche se upar chalo - ek hi 1D array kaafi
    static int minimumTotal(List<List<Integer>> triangle) {
        List<Integer> last = triangle.get(triangle.size() - 1);
        int[] dp = new int[last.size()]; // aakhri row hi shuruaat
        for (int c = 0; c < last.size(); c++) dp[c] = last.get(c);
        for (int r = triangle.size() - 2; r >= 0; r--) {
            for (int c = 0; c <= r; c++) {
                dp[c] = triangle.get(r).get(c) + Math.min(dp[c], dp[c + 1]); // neeche ke do mein sasta (dp[c] abhi purani row ka hai)
            }
        }
        return dp[0];
    }

    public static void main(String[] args) {
        System.out.println(minimumTotal(List.of(List.of(3), List.of(7, 4), List.of(2, 4, 6), List.of(8, 5, 9, 3))));
        System.out.println(minimumTotal(List.of(List.of(-10))));
    }
}

// Output:
// 16
// -10
