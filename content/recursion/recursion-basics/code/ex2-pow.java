class Main {
    // x ki power n (n negative bhi ho sakta hai)
    static double myPow(double x, int n) {
        long e = n; // Integer.MIN_VALUE ko positive karo to int overflow - isliye long
        double b = x;
        if (e < 0) { // x^(-n) = (1/x)^n
            b = 1 / b;
            e = -e;
        }
        return fastPow(b, e);
    }

    // x^n = (x^(n/2))^2, odd n par ek x aur. Har call n aadha: O(log n)
    static double fastPow(double x, long n) {
        if (n == 0) return 1.0; // x^0 = 1 //@base
        double half = fastPow(x, n / 2); // SIRF ek call - result do baar use karo //@call
        return n % 2 == 0 ? half * half : half * half * x; //@ret
    }

    public static void main(String[] args) {
        System.out.println(myPow(2.0, 10));
        System.out.println(myPow(2.0, -2));
        System.out.println(myPow(1.0, Integer.MIN_VALUE));
    }
}

// Output:
// 1024.0
// 0.25
// 1.0
