import java.util.Arrays;

class Main {
    // 0..n har number mein kitne 1 bits. i >> 1 = i ke bits bina aakhri bit ke - uska jawab pehle se pata (DP)
    static int[] countBits(int n) {
        int[] ans = new int[n + 1]; // ans[0] = 0
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i >> 1] + (i & 1); // aadhe wale ke 1s + aakhri bit //@step
        }
        return ans; //@done
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(countBits(8)));
        System.out.println(Arrays.toString(countBits(0)));
    }
}

// Output:
// [0, 1, 1, 2, 1, 2, 2, 3, 1]
// [0]
