class Main {
    // Java mein tailrec nahi hota. Bahut gehri recursion ki jagah loop likho.
    // (Kotlin ka tailrec wala code andar se bilkul aisa hi loop banta hai.)
    static long sumToLoop(long n) {
        long acc = 0;
        while (n > 0) {
            acc += n;
            n--;
        }
        return acc;
    }

    // Normal recursion: call ke BAAD '+ n' karna baaki hai, isliye har call ka frame stack par rukta hai
    static long sumToPlain(long n) {
        return n == 0 ? 0 : n + sumToPlain(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sumToLoop(100_000));
        System.out.println(sumToPlain(1000)); // chhota n: theek hai
        try {
            System.out.println(sumToPlain(1_000_000)); // 10 lakh frames: stack khatam
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError");
        }
    }
}

// Output:
// 5000050000
// 500500
// StackOverflowError
