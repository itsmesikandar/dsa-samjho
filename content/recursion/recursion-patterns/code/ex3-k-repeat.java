class Main {
    // Sabse lamba substring jismein HAR character kam se kam k baar aaye
    static int longestSubstring(String s, int k) {
        return solve(s, 0, s.length(), k);
    }

    // s[lo, hi) ka jawab
    static int solve(String s, int lo, int hi, int k) {
        if (hi - lo < k) return 0; // itne chhote hisse mein koi char k baar aa hi nahi sakta //@base
        int[] cnt = new int[26];
        for (int i = lo; i < hi; i++) cnt[s.charAt(i) - 'a']++; //@count
        int best = 0;
        int start = lo;
        for (int i = lo; i < hi; i++) {
            if (cnt[s.charAt(i) - 'a'] < k) { // ye char kisi answer mein nahi aa sakta: yahin todo //@split
                best = Math.max(best, solve(s, start, i, k)); // pichla piece alag se hal karo
                start = i + 1;
            }
        }
        if (start == lo) return hi - lo; // koi kharab char nahi mila: poora hissa valid //@whole
        return Math.max(best, solve(s, start, hi, k)); // aakhri piece //@ret
    }

    public static void main(String[] args) {
        System.out.println(longestSubstring("ababbc", 2));
        System.out.println(longestSubstring("aaabb", 3));
        System.out.println(longestSubstring("abcde", 2));
    }
}

// Output:
// 5
// 3
// 0
