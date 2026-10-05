class Main {
    public static void main(String[] args) {
        // Har primitive type kitne bytes ka hota hai
        System.out.println("Byte: " + Byte.BYTES + ", Short: " + Short.BYTES + ", Int: " + Integer.BYTES + ", Long: " + Long.BYTES);
        System.out.println("Char: " + Character.BYTES + ", Float: " + Float.BYTES + ", Double: " + Double.BYTES);

        // int = 4 bytes = 32 bits, isliye iski ek limit hai
        System.out.println(Integer.MAX_VALUE);

        // Limit cross karte hi number ghoom ke negative ho jaata hai (overflow) - koi error nahi!
        int big = Integer.MAX_VALUE;
        System.out.println(big + 1);

        // Bada answer chahiye to long (8 bytes) use karo
        System.out.println((long) big + 1);
    }
}

// Output:
// Byte: 1, Short: 2, Int: 4, Long: 8
// Char: 2, Float: 4, Double: 8
// 2147483647
// -2147483648
// 2147483648
