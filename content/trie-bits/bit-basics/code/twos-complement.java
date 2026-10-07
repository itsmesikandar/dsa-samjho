class Main {
    // Negative numbers: two's complement. -x = ~x + 1. Sabse left (31st) bit = sign
    public static void main(String[] args) {
        int x = 5;
        System.out.println(Integer.toBinaryString(x)); // 101
        System.out.println(Integer.toBinaryString(-x)); // 32 bits: aage sab 1
        System.out.println(Integer.toString(-x, 2)); // toString(n, 2) sign alag likhta - bits nahi dikhata
        System.out.println(~x + 1); // ~x + 1 = -x
        System.out.println((-16 >> 2) + " " + (-16 >>> 28)); // >> sign bit copy karta, >>> left se 0 bharta
        int big = Integer.MAX_VALUE;
        System.out.println(big + 1); // overflow: wrap hoke sabse chhota int
    }
}

// Output:
// 101
// 11111111111111111111111111111011
// -101
// -5
// -4 15
// -2147483648
