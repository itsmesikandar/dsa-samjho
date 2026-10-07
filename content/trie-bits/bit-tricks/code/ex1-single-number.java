class Main {
    // Ek number akela, baaki sab 2-2 baar. x ^ x = 0, x ^ 0 = x - jode kat jaate, akela bachta
    static int singleNumber(int[] nums) {
        int r = 0;
        for (int x : nums) r ^= x; // order se farak nahi (XOR commutative) //@xor
        return r; //@done
    }

    public static void main(String[] args) {
        System.out.println(singleNumber(new int[] {7, 3, 5, 3, 7}));
        System.out.println(singleNumber(new int[] {1}));
    }
}

// Output:
// 5
// 1
