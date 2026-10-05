class Main {
    // Sirf letters/digits dekho, case ignore karo. Dono kinaron se milao.
    static boolean isPalindrome(String s) {
        int l = 0; //@init
        int r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++; // faltu char (space, comma) skip //@skipL
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--; //@skipR
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false; // mismatch //@cmp
            l++; // match - dono andar //@move
            r--;
        }
        return true; //@done
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(isPalindrome("race a car"));
    }
}

// Output:
// true
// false
