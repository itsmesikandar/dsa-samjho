class Main {
    // Line height ke badhte order mein honi chahiye. Kitne students galat jagah khade hain?
    static int heightChecker(int[] heights) {
        int[] expected = heights.clone(); // asli line mat chhedo, copy ko sort karo
        for (int i = 0; i < expected.length - 1; i++) { // selection sort
            int min = i;
            for (int j = i + 1; j < expected.length; j++) if (expected[j] < expected[min]) min = j; //@find
            int t = expected[i]; // sabse chhota aage //@swap
            expected[i] = expected[min];
            expected[min] = t;
        }
        int count = 0;
        for (int i = 0; i < heights.length; i++) if (heights[i] != expected[i]) count++; // jagah alag? //@compare
        return count;
    }

    public static void main(String[] args) {
        System.out.println(heightChecker(new int[]{1, 1, 4, 2, 1, 3}));
        System.out.println(heightChecker(new int[]{1, 2, 3, 4, 5}));
    }
}

// Output:
// 3
// 0
