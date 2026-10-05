import java.util.Arrays;

class Main {
    // Har item apni sorted jagah se zyada se zyada k door hai. Sort karo.
    // Insertion sort: koi bhi item k se zyada jagah peeche nahi khiskega -> O(n*k), O(n^2) nahi
    static int sortNearlySorted(int[] a) {
        int shifts = 0;
        for (int i = 1; i < a.length; i++) {
            int key = a[i]; //@pick
            int j = i - 1;
            while (j >= 0 && a[j] > key) { // ye loop max k baar chalega //@shift
                a[j + 1] = a[j];
                j--;
                shifts++;
            }
            a[j + 1] = key; //@place
        }
        return shifts;
    }

    public static void main(String[] args) {
        int[] a = {6, 5, 3, 2, 8, 10, 9}; // k = 3
        int shifts = sortNearlySorted(a);
        System.out.println(Arrays.toString(a));
        System.out.println("shifts = " + shifts + " (n*k = " + (a.length * 3) + " se kam)");
    }
}

// Output:
// [2, 3, 5, 6, 8, 9, 10]
// shifts = 7 (n*k = 21 se kam)
