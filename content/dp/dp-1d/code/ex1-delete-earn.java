class Main {
    // Value v lo to saare v milte hain, par v-1 aur v+1 jal jaate hain = values par house robber!
    static int deleteAndEarn(int[] nums) {
        int maxV = 0;
        for (int x : nums) maxV = Math.max(maxV, x);
        int[] points = new int[maxV + 1];
        for (int x : nums) points[x] += x; // har value ka "ghar" - usme kitna paisa //@bucket
        int take = 0; // pichhli value LI to ab tak ka best
        int skip = 0; // pichhli value CHHODI to ab tak ka best
        for (int v = 0; v <= maxV; v++) {
            int newTake = skip + points[v]; // v lena hai to v-1 chhoda hona chahiye //@take
            skip = Math.max(skip, take); // v chhodo - pichhla kuch bhi chalega
            take = newTake;
        }
        return Math.max(take, skip); //@done
    }

    public static void main(String[] args) {
        System.out.println(deleteAndEarn(new int[] {1, 1, 2, 3, 3, 5}));
        System.out.println(deleteAndEarn(new int[] {5}));
    }
}

// Output:
// 13
// 5
