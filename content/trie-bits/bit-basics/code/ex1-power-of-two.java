class Main {
    // 2 ki power = binary mein EXACTLY ek bit 1. n & (n - 1) sabse daayein wala 1 mita deta - kuch na bache to ek hi tha
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0; // n > 0 zaroori: 0 aur negative kabhi power nahi //@check
    }

    public static void main(String[] args) {
        System.out.println(isPowerOfTwo(16));
        System.out.println(isPowerOfTwo(12));
        System.out.println(isPowerOfTwo(0));
        System.out.println(isPowerOfTwo(Integer.MIN_VALUE)); // sirf sign bit 1 - par negative hai
    }
}

// Output:
// true
// false
// false
// false
