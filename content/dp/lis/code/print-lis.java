import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class Main {
    // LIS ka sequence bhi: har i par yaad rakho kis j se aaye (parent), phir best i se peeche chalo
    static List<Integer> lisSequence(int[] nums) {
        int n = nums.length;
        List<Integer> seq = new ArrayList<>();
        if (n == 0) return seq;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int[] parent = new int[n];
        Arrays.fill(parent, -1); // -1 = chain yahin se shuru
        int end = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    parent[i] = j;
                }
            }
            if (dp[i] > dp[end]) end = i;
        }
        for (int k = end; k != -1; k = parent[k]) seq.add(nums[k]);
        Collections.reverse(seq); // peeche se banaya - ulta karo
        return seq;
    }

    public static void main(String[] args) {
        System.out.println(lisSequence(new int[] {5, 2, 8, 6, 3, 6, 9, 7}));
        System.out.println(lisSequence(new int[] {4, 4, 4}));
    }
}

// Output:
// [2, 3, 6, 9]
// [4]
