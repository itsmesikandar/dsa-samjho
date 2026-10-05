class Main {
    static boolean isVowel(char c) {
        return "aeiou".indexOf(c) >= 0;
    }

    // Length k ke kisi bhi substring mein zyada se zyada kitne vowels?
    static int maxVowels(String s, int k) {
        int count = 0;
        for (int i = 0; i < k; i++) if (isVowel(s.charAt(i))) count++; // pehli window ke vowels //@first
        int best = count;
        for (int r = k; r < s.length(); r++) {
            if (isVowel(s.charAt(r))) count++; // naya char window mein aaya //@add
            if (isVowel(s.charAt(r - k))) count--; // sabse purana char window se gaya //@remove
            best = Math.max(best, count); //@best
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(maxVowels("abciiidef", 3));
        System.out.println(maxVowels("leetcode", 3));
    }
}

// Output:
// 3
// 2
