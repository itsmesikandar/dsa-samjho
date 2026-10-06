import java.util.Arrays;

class Main {
    // Do number akele (a, b), baaki sab do-do baar. Sabka XOR = a ^ b. Uska koi 1 bit = a aur b wahan alag - us bit se do groups
    static int[] singleNumberIII(int[] nums) {
        int all = 0;
        for (int x : nums) all ^= x; // jode kate - bacha a ^ b //@all
        int diff = all & -all; // sabse daayein ka 1 bit: a aur b isi par alag //@bit
        int a = 0;
        int b = 0;
        for (int x : nums) {
            if ((x & diff) != 0) a ^= x; // jode ek hi group mein jaate, kat jaate //@split
            else b ^= x;
        }
        return new int[] {a, b}; //@done
    }

    public static void main(String[] args) {
        int[] r = singleNumberIII(new int[] {6, 4, 9, 6, 4, 2});
        Arrays.sort(r);
        System.out.println(Arrays.toString(r));
        int[] s = singleNumberIII(new int[] {0, 1});
        Arrays.sort(s);
        System.out.println(Arrays.toString(s));
    }
}

// Output:
// [2, 9]
// [0, 1]
