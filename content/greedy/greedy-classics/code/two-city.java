import java.util.Arrays;

class Main {
    // 2n log, n ko city A, n ko city B. Kise A bhejein? Jinka A mein bhejna B se sabse zyada SASTA (a - b sabse chhota)
    static int twoCitySchedCost(int[][] costs) {
        Arrays.sort(costs, (x, y) -> Integer.compare(x[0] - x[1], y[0] - y[1])); // A ka "fayda" sabse zyada pehle
        int n = costs.length / 2;
        int total = 0;
        for (int i = 0; i < costs.length; i++) total += i < n ? costs[i][0] : costs[i][1]; // pehle n -> A, baaki -> B
        return total;
    }

    public static void main(String[] args) {
        System.out.println(twoCitySchedCost(new int[][] {{20, 60}, {30, 25}, {100, 40}, {50, 70}}));
        System.out.println(twoCitySchedCost(new int[][] {{1, 2}, {3, 4}}));
    }
}

// Output:
// 135
// 5
