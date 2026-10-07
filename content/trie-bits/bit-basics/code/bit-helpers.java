class Main {
    // Roz ke bit kaam - sab O(1). i = bit number (0 = sabse right)
    static boolean isOdd(int x) { return (x & 1) == 1; } // aakhri bit 1 = odd (negative par bhi sahi, x % 2 nahi)
    static int getBit(int x, int i) { return (x >> i) & 1; } // bit i: 0 ya 1
    static int setBit(int x, int i) { return x | (1 << i); } // bit i ko 1 karo
    static int clearBit(int x, int i) { return x & ~(1 << i); } // bit i ko 0 karo
    static int toggleBit(int x, int i) { return x ^ (1 << i); } // bit i ulta karo
    static int lowestSetBit(int x) { return x & -x; } // sirf sabse right wala 1 bacha, baaki 0

    public static void main(String[] args) {
        int x = 13; // 1101
        System.out.println(isOdd(x) + " " + getBit(x, 1) + " " + getBit(x, 2));
        System.out.println(setBit(x, 1) + " " + clearBit(x, 0) + " " + toggleBit(x, 3)); // 1111, 1100, 0101
        System.out.println(lowestSetBit(12)); // 1100 -> 100
        System.out.println(isOdd(-3) + " " + (-3 % 2)); // % negative par -1 deta hai - isliye x % 2 == 1 galat
    }
}

// Output:
// true 0 1
// 15 12 5
// 4
// true -1
