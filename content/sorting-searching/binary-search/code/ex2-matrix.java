class Main {
    // Har row sorted, aur har row ka pehla number pichhli row ke aakhri se bada. Target hai?
    static boolean searchMatrix(int[][] m, int target) {
        int cols = m[0].length;
        int lo = 0, hi = m.length * cols - 1; // poori matrix ko ek lambi sorted line maano
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int v = m[mid / cols][mid % cols]; // line ka index -> (row, col) //@map
            if (v == target) return true; //@found
            if (v < target) lo = mid + 1; //@right
            else hi = mid - 1; //@left
        }
        return false; //@none
    }

    public static void main(String[] args) {
        int[][] m = {{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}};
        System.out.println(searchMatrix(m, 16));
        System.out.println(searchMatrix(m, 13));
    }
}

// Output:
// true
// false
