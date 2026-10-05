class Main {
    // Array ka size nahi pata. reader.get(i) bahar ke index par Integer.MAX_VALUE deta hai.
    static class ArrayReader {
        private final int[] a;

        ArrayReader(int[] a) {
            this.a = a;
        }

        int get(int i) {
            return i < a.length ? a[i] : Integer.MAX_VALUE;
        }
    }

    static int search(ArrayReader reader, int target) {
        int hi = 1;
        while (reader.get(hi) < target) hi *= 2; // range double karte jao jab tak target andar na aa jaaye //@grow
        int lo = hi / 2; // pichhli baar wala hi - usse pehle target ho hi nahi sakta
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int v = reader.get(mid); //@mid
            if (v == target) return mid; //@found
            if (v < target) lo = mid + 1; //@right
            else hi = mid - 1; // MAX_VALUE bhi yahan aata hai: bahar = 'bahut bada' //@left
        }
        return -1; //@none
    }

    public static void main(String[] args) {
        ArrayReader reader = new ArrayReader(new int[]{-1, 0, 3, 5, 9, 12, 15, 20, 25, 31, 40});
        System.out.println(search(reader, 25));
        System.out.println(search(reader, 2));
    }
}

// Output:
// 8
// -1
