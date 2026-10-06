import java.util.ArrayList;
import java.util.List;

class Main {
    // Chhota set (elements 0..31) = ek int. Set ke kaam = bit ops, sab O(1)
    public static void main(String[] args) {
        int a = 0;
        a = a | (1 << 1) | (1 << 3); // add 1 aur 3: {1, 3}
        int b = (1 << 3) | (1 << 4); // {3, 4}
        System.out.println(Integer.toBinaryString(a));
        System.out.println((a | b) + " " + (a & b) + " " + (a & ~b)); // union {1,3,4}, common {3}, a - b {1}
        System.out.println(((a >> 3) & 1) == 1); // 3 set mein hai?
        System.out.println(Integer.bitCount(a | b)); // union ka size
        // mask ke saare sub-masks (subsets): sub = (sub - 1) & mask
        int mask = 11; // 1011
        List<Integer> subs = new ArrayList<>();
        for (int sub = mask; sub > 0; sub = (sub - 1) & mask) subs.add(sub);
        System.out.println(subs);
    }
}

// Output:
// 1010
// 26 8 2
// true
// 3
// [11, 10, 9, 8, 3, 2, 1]
