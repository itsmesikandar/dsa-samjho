class Main {
    // Helper pattern: bahar wala function simple rehta hai,
    // asli kaam helper karta hai extra parameters (l, r) ke saath - koi substring copy nahi
    static boolean isPalindrome(String s) {
        return isPal(s, 0, s.length() - 1);
    }

    static boolean isPal(String s, int l, int r) {
        if (l >= r) return true; // 0 ya 1 char: palindrome hi hai
        if (s.charAt(l) != s.charAt(r)) return false; // kinare alag: wahin khatam
        return isPal(s, l + 1, r - 1); // andar wala hissa
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("abca"));
        System.out.println(isPalindrome(""));
    }
}

// Output:
// true
// false
// true
