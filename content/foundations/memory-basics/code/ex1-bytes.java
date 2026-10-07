class Main {
    // n ints ke liye kitni memory (bytes)? long return karo, taaki bade n par overflow na ho
    static long bytesForInts(int n) {
        return (long) n * Integer.BYTES; // har int = 4 bytes //@calc
    }

    public static void main(String[] args) {
        System.out.println(bytesForInts(3)); // 3 x 4 = 12
        System.out.println(bytesForInts(100_000)); // 1 lakh ints = 400000 bytes (~390 KB)
        System.out.println(Long.BYTES); // long = 8 bytes, matlab long[] double memory
    }
}

// Output:
// 12
// 400000
// 8
