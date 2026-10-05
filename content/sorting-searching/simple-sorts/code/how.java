import java.util.Arrays;

class Main {
    // Insertion sort: taash ke patton jaisa - har naya item pichhle sorted hisse mein sahi jagah baithta hai
    static void insertionSort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i]; // ise sahi jagah bithana hai //@pick
            int j = i - 1;
            while (j >= 0 && a[j] > key) { // key se bade items ek-ek jagah daayein khiskao //@shift
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key; // bani hui khaali jagah mein key //@place
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 4, 6, 1, 3};
        insertionSort(a);
        System.out.println(Arrays.toString(a));
        int[] b = {1, 2, 3};
        insertionSort(b); // pehle se sorted: ek bhi shift nahi, O(n)
        System.out.println(Arrays.toString(b));
    }
}

// Output:
// [1, 2, 3, 4, 5, 6]
// [1, 2, 3]
