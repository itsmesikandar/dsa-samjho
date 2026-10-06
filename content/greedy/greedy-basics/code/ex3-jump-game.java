class Main {
    // Har jump try karne ki zaroorat nahi: bas yaad rakho "ab tak kahan tak pahunch sakte hain"
    static boolean canJump(int[] nums) {
        int reach = 0; // sabse door index jahan tak pahunch sakte hain //@init
        for (int i = 0; i < nums.length; i++) {
            if (i > reach) return false; // i tak koi rasta nahi - aage ka sawaal hi nahi //@stuck
            reach = Math.max(reach, i + nums[i]); // i se aur aage? //@reach
            if (reach >= nums.length - 1) return true; // aakhri index pahunch mein //@done
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(canJump(new int[] {3, 1, 0, 2, 0, 1}));
        System.out.println(canJump(new int[] {2, 1, 0, 3}));
        System.out.println(canJump(new int[] {0}));
    }
}

// Output:
// true
// false
// true
