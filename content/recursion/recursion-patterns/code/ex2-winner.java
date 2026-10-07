class Main {
    // 2 players baari-baari array ke kisi edge se ek number uthate hain. Player 1 jeet (ya tie) sakta hai?
    static boolean predictTheWinner(int[] nums) {
        return diff(nums, 0, nums.length - 1) >= 0;
    }

    // nums[l..r] bacha hai: jiski baari hai wo saamne wale se KITNA aage reh sakta hai (dono best khelein to)
    static int diff(int[] nums, int l, int r) {
        if (l == r) return nums[l]; // ek hi number: le lo //@base
        int pickL = nums[l] - diff(nums, l + 1, r); // left liya; baaki par saamne wala apna best diff banayega //@pickL
        int pickR = nums[r] - diff(nums, l, r - 1); // right liya //@pickR
        return Math.max(pickL, pickR); // jo zyada fayde ka //@ret
    }

    public static void main(String[] args) {
        System.out.println(predictTheWinner(new int[]{1, 5, 2}));
        System.out.println(predictTheWinner(new int[]{1, 5, 233, 7}));
    }
}

// Output:
// false
// true
