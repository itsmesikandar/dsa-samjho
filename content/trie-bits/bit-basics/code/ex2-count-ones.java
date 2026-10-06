class Main {
    // Kitne 1 bits? x & (x - 1) har baar sabse daayein wala 1 mitata - loop sirf utni baar jitne 1 bits
    static int hammingWeight(int n) {
        int x = n;
        int count = 0;
        while (x != 0) {
            x = x & (x - 1); // sabse daayein wala 1 gaya //@drop
            count++;
        }
        return count; //@done
    }

    public static void main(String[] args) {
        System.out.println(hammingWeight(26)); // 11010
        System.out.println(hammingWeight(-1)); // saare 32 bits 1 (negative bhi chalta - loop 0 tak pahunchta hai)
        System.out.println(Integer.bitCount(26)); // library wala tareeka
    }
}

// Output:
// 3
// 32
// 3
