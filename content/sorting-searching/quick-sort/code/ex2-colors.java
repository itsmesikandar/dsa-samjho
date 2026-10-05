import java.util.Arrays;

class Main {
    // Sirf 0, 1, 2 hain. Ek hi pass mein sort karo (in-place): 0 aage, 1 beech, 2 peeche.
    static void sortColors(int[] a) {
        int low = 0; // a[0 .. low-1] = sab 0
        int mid = 0; // a[low .. mid-1] = sab 1; a[mid..high] abhi dekhe nahi
        int high = a.length - 1; // a[high+1 ..] = sab 2
        while (mid <= high) {
            if (a[mid] == 0) { // 0 ko aage wale hisse mein bhejo //@zero
                swap(a, low, mid);
                low++;
                mid++;
            } else if (a[mid] == 1) { // 1 pehle se sahi hisse mein //@one
                mid++;
            } else { // 2 ko peeche bhejo; mid mat badhao - wahan se aaya item abhi dekha nahi //@two
                swap(a, mid, high);
                high--;
            }
        }
    }

    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    public static void main(String[] args) {
        int[] a = {2, 0, 2, 1, 1, 0};
        sortColors(a);
        System.out.println(Arrays.toString(a));
    }
}

// Output:
// [0, 0, 1, 1, 2, 2]
