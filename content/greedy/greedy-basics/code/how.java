import java.util.Arrays;

class Main {
    // Budget mein zyada se zyada cheezein: har baar sabse SASTI lo (greedy)
    static int maxItems(int[] costs, int budget) {
        int[] sorted = costs.clone();
        Arrays.sort(sorted); // sasti pehle //@sort
        int left = budget, count = 0;
        for (int c : sorted) {
            if (c > left) break; // ye nahi le sakte - aage wali isse bhi mehngi //@stop
            left -= c; // abhi ki sabse sasti lo //@take
            count++;
        }
        return count; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxItems(new int[] {6, 2, 9, 3, 1, 4}, 10));
        System.out.println(maxItems(new int[] {10, 20}, 5));
        System.out.println(maxItems(new int[] {2, 2, 2}, 6));
    }
}

// Output:
// 4
// 0
// 3
