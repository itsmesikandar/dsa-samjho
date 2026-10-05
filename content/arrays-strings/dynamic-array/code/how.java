class Main {
    // Apna chhota ArrayList: andar ek int[], bhar jaaye to double size ka naya array
    static class MyIntList {
        private int[] data = new int[2]; // shuru mein chhoti capacity
        private int size = 0; // kitne items sach mein bhare hain

        void add(int x) {
            if (size == data.length) grow(); // bhar gaya? pehle bada karo //@check
            data[size] = x; // pehli khaali jagah par rakho //@put
            size++;
        }

        private void grow() {
            int[] bigger = new int[data.length * 2]; // double capacity ka naya array //@alloc
            for (int i = 0; i < size; i++) bigger[i] = data[i]; // purane items ek-ek karke copy //@copy
            data = bigger; // ab naya array hi hamara array //@swap
        }

        int get(int i) {
            if (i < 0 || i >= size) throw new IndexOutOfBoundsException("index " + i + ", size " + size);
            return data[i];
        }

        int size() { return size; }

        int capacity() { return data.length; }
    }

    public static void main(String[] args) {
        MyIntList list = new MyIntList();
        for (int x : new int[]{10, 20, 30, 40, 50}) list.add(x);
        System.out.println("size = " + list.size() + ", capacity = " + list.capacity());
        System.out.println(list.get(4));
    }
}

// Output:
// size = 5, capacity = 8
// 50
