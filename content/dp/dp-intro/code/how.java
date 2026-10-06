class Main {
    // Recursion + yaaddasht (memo): har fib(k) sirf EK baar nikaalo, dobara poocha to memo se
    static long fib(int n, long[] memo) {
        if (n <= 1) return n; // base case: fib(0) = 0, fib(1) = 1 //@base
        if (memo[n] != 0) return memo[n]; // pehle nikaala hua - seedha lautao //@hit
        memo[n] = fib(n - 1, memo) + fib(n - 2, memo); // pehli baar - nikaalo aur likh lo //@save
        return memo[n];
    }

    public static void main(String[] args) {
        System.out.println(fib(6, new long[7]));
        System.out.println(fib(50, new long[51])); // bina memo ke ~4 x 10^10 calls; memo se 99
    }
}

// Output:
// 8
// 12586269025
