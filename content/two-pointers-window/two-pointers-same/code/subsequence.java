class Main {
    // s, t ka subsequence hai? (s ke characters t mein usi order mein, beech mein gap chalega)
    static boolean isSubsequence(String s, String t) {
        int i = 0; // s mein kahan tak match hua
        for (char c : t.toCharArray()) { // t par ek pointer, s par doosra - dono aage hi badhte hain
            if (i < s.length() && s.charAt(i) == c) i++; // s ka agla char mil gaya
        }
        return i == s.length(); // s ke saare chars mile?
    }

    public static void main(String[] args) {
        System.out.println(isSubsequence("ace", "abcde"));
        System.out.println(isSubsequence("aec", "abcde")); // order galat
    }
}

// Output:
// true
// false
