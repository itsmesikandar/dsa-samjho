import java.util.Arrays;

class Main {
    // index wala item hatao; uske baad ke saare items ek kadam left khisakenge
    static int deleteAt(int[] arr, int size, int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException("Galat index");
        for (int i = index; i < size - 1; i++) {
            arr[i] = arr[i + 1]; // right wala item left mein aaya, gap bhar gaya
        }
        arr[size - 1] = 0; // last dabba ab khaali (safai ke liye)
        return size - 1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int size = 5;
        size = deleteAt(arr, size, 1); // 20 hatao
        System.out.println(Arrays.toString(Arrays.copyOf(arr, size)));
        System.out.println("size = " + size);
    }
}

// Output:
// [10, 30, 40, 50]
// size = 4
