import java.util.Arrays;

class Main {
    // Counting sort: values chhoti range (0..maxVal) mein hon to compare kiye bina sort - O(n + k)
    static void countingSort(int[] a, int maxVal) {
        int[] count = new int[maxVal + 1];
        for (int x : a) count[x]++; // har value kitni baar aayi //@count
        int i = 0;
        for (int v = 0; v <= maxVal; v++) { // chhoti value se shuru, jitni baar aayi utni baar likho
            for (int c = 0; c < count[v]; c++) a[i++] = v; //@write
        }
    }

    public static void main(String[] args) {
        int[] a = {4, 2, 2, 8, 3, 3, 1};
        countingSort(a, 8);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [1, 2, 2, 3, 3, 4, 8]
