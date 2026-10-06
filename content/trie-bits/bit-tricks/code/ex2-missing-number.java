class Main {
    // 0..n mein se ek number gayab. Saare index (0..n) aur saari values XOR - jo dono jagah hain kat jaate, gayab bachta
    static int missingNumber(int[] nums) {
        int x = nums.length; // index n loop mein nahi aata - pehle hi daal do
        for (int i = 0; i < nums.length; i++) {
            x = x ^ i ^ nums[i]; // index bhi, value bhi //@xor
        }
        return x; //@done
    }

    public static void main(String[] args) {
        System.out.println(missingNumber(new int[] {4, 0, 1, 3}));
        System.out.println(missingNumber(new int[] {0}));
    }
}

// Output:
// 2
// 1
