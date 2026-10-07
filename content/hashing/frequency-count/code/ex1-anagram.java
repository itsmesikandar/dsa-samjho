class Main {
    // Anagram = same letters, same count, bas order alag
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26]; //@init
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++; // s ka letter: +1 //@plus
            count[t.charAt(i) - 'a']--; // t ka letter: -1 //@minus
        }
        for (int c : count) {
            if (c != 0) return false; // kisi letter ka hisaab barabar nahi //@check
        }
        return true; //@done
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));
        System.out.println(isAnagram("rat", "car"));
    }
}

// Output:
// true
// false
