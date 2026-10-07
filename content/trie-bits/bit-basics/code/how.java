class Main {
    // Bitwise operators: har bit par alag se kaam - result ka bit k sirf a ke bit k aur b ke bit k se
    public static void main(String[] args) {
        int a = 12; // 1100
        int b = 10; // 1010
        System.out.println(a & b); // AND: dono 1 tabhi 1 -> 1000 = 8 //@and
        System.out.println(a | b); // OR: koi ek 1 to 1 -> 1110 = 14 //@or
        System.out.println(a ^ b); // XOR: alag ho to 1 -> 0110 = 6 //@xor
        System.out.println(~a); // NOT: saare 32 bits ulte -> -13 (two's complement) //@not
        System.out.println(a << 1); // left shift: har bit ek step left = x2 -> 24 //@shl
        System.out.println(a >> 1); // right shift: ek step right = /2 -> 6 //@shr
    }
}

// Output:
// 8
// 14
// 6
// -13
// 24
// 6
