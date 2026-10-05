class Main {
    static int calls = 0; // kitni baar fib() call hua

    static int fib(int n) {
        calls++; // har call gino //@count
        if (n < 2) return n; // base case: fib(0) = 0, fib(1) = 1 //@base
        return fib(n - 1) + fib(n - 2); // har call do naye calls banata hai //@rec
    }

    public static void main(String[] args) {
        System.out.println(fib(5));
        System.out.println(calls); // fib(5) ke liye kitne calls
        calls = 0;
        fib(20);
        System.out.println(calls); // n sirf 20, par calls 21 hazaar se zyada!
    }
}

// Output:
// 5
// 15
// 21891
