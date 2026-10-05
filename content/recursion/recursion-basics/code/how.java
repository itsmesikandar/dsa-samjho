class Main {
    // n! = n x (n-1) x ... x 1. Recursion mein: n! = n x (n-1)!
    static long factorial(int n) {
        if (n <= 1) return 1; // base case: yahin ruko, warna calls kabhi khatam nahi hongi //@base
        long rest = factorial(n - 1); // wahi sawaal, ek chhota: (n-1)! - bharosa karo ki sahi aayega //@call
        return n * rest; // apna hissa jodo aur upar wapas do //@ret
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
        System.out.println(factorial(0));
        System.out.println(factorial(20)); // long ki limit ke paas (21! overflow karega)
    }
}

// Output:
// 120
// 1
// 2432902008176640000
