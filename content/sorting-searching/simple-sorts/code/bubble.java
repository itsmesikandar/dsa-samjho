import java.util.Arrays;

class Main {
    // Bubble sort: padosiyon ko compare karo, galat order ho to swap.
    // Har pass mein bacha hua sabse bada item end tak 'bubble' ho jaata hai.
    static void bubbleSort(int[] a) {
        int n = a.length;
        for (int pass = 0; pass < n - 1; pass++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - pass; j++) { // aakhri 'pass' items pehle se apni jagah par
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) break; // poore pass mein ek bhi swap nahi = sorted, ruk jao
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 4, 2, 8};
        bubbleSort(a);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [1, 2, 4, 5, 8]
