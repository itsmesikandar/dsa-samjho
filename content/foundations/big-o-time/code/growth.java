class Main {
    // log2(n): n ko kitni baar aadha karein ki 1 bache (integer wala, floor)
    static long log2(long n) {
        long x = n, c = 0;
        while (x > 1) {
            x /= 2;
            c++;
        }
        return c;
    }

    public static void main(String[] args) {
        long[] sizes = {10, 1_000, 100_000, 1_000_000};
        System.out.println("n | log n | n log n | n^2");
        for (long n : sizes) {
            // long use kiya, kyunki n^2 = 10^12 int mein fit nahi hota
            System.out.println(n + " | " + log2(n) + " | " + (n * log2(n)) + " | " + (n * n));
        }
    }
}

// Output:
// n | log n | n log n | n^2
// 10 | 3 | 30 | 100
// 1000 | 9 | 9000 | 1000000
// 100000 | 16 | 1600000 | 10000000000
// 1000000 | 19 | 19000000 | 1000000000000
