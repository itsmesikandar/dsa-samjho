import java.util.Arrays;

class Main {
    // Selection sort: har pass mein bache hue hisse ka sabse chhota dhoondho, use aage rakh do
    static void selectionSort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j; // sabse chhota kahan hai?
            if (min != i) { // har pass mein zyada se zyada EK swap
                int t = a[i];
                a[i] = a[min];
                a[min] = t;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {64, 25, 12, 22, 11};
        selectionSort(a);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [11, 12, 22, 25, 64]
