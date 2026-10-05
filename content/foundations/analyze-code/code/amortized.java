class Main {
    // Dynamic array (ArrayList) jaisa: bhar jaaye to capacity double, saare items copy
    public static void main(String[] args) {
        int capacity = 1, size = 0, copies = 0;
        int n = 1000;
        for (int k = 0; k < n; k++) {
            if (size == capacity) { // bhar gaya
                copies += size; // purane saare items nayi array mein copy
                capacity *= 2;
            }
            size++; // naya item daala
        }
        // 1000 pushes mein copies sirf ~1000 -> har push par average ~1 copy = amortized O(1)
        System.out.println("pushes = " + n + ", total copies = " + copies + ", capacity = " + capacity);
    }
}

// Output:
// pushes = 1000, total copies = 1023, capacity = 1024
