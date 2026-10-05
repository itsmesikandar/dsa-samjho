import java.util.Arrays;

class Main {
    // Array mein index par naya value daalna. size = abhi kitne dabbe bhare hain
    static int insertAt(int[] arr, int size, int index, int value) {
        if (size >= arr.length) throw new IllegalStateException("Array full hai"); //@check
        if (index < 0 || index > size) throw new IndexOutOfBoundsException("Galat index");
        int i = size - 1; // last bhare hue dabbe se shuru //@init
        while (i >= index) { // index tak peeche aate jao //@loop
            arr[i + 1] = arr[i]; // har item ek kadam right copy //@shift
            i--;
        }
        arr[index] = value; // ab ye jagah khaali hai, value rakh do //@place
        return size + 1; // ek item badh gaya //@done
    }

    public static void main(String[] args) {
        // capacity 8, lekin abhi sirf 5 dabbe bhare hain
        int[] arr = {10, 20, 30, 40, 50, 0, 0, 0};
        int size = 5;
        size = insertAt(arr, size, 2, 99);
        System.out.println(Arrays.toString(Arrays.copyOf(arr, size)));
        System.out.println("size = " + size);
    }
}

// Output:
// [10, 20, 99, 30, 40, 50]
// size = 6
