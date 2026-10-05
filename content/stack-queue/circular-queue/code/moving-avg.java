class Main {
    // Stream ki pichhli 'size' values ka average - circular buffer (ring buffer) se
    static class MovingAverage {
        private final int[] buf;
        private int idx = 0; // agli value kahan likhni hai
        private int count = 0;
        private long sum = 0;

        MovingAverage(int size) {
            buf = new int[size];
        }

        double next(int v) {
            if (count == buf.length) sum -= buf[idx]; // sabse purani value overwrite hone wali hai: sum se hatao
            else count++;
            buf[idx] = v;
            sum += v;
            idx = (idx + 1) % buf.length; // ghoom ke wapas shuru
            return (double) sum / count;
        }
    }

    public static void main(String[] args) {
        MovingAverage m = new MovingAverage(3);
        System.out.println(m.next(1));
        System.out.println(m.next(10));
        System.out.println(m.next(3));
        System.out.println(m.next(5)); // 1 gaya: (10 + 3 + 5) / 3
    }
}

// Output:
// 1.0
// 5.5
// 4.666666666666667
// 6.0
