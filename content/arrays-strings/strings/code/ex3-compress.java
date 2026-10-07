class Main {
    // "aaabbc" -> "a3b2c": har continuous run ka char + uski count (count sirf tab jab 1 se zyada)
    static String compress(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i; // naya run yahan se shuru //@start
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++; // jab tak same char, aage badho //@run
            sb.append(s.charAt(i)); // run ka char likho //@write
            if (j - i > 1) sb.append(j - i); // run lamba hai to count bhi
            i = j; // agla run //@next
        }
        return sb.toString(); //@done
    }

    public static void main(String[] args) {
        System.out.println(compress("aaabbc"));
        System.out.println(compress("abc")); // koi run nahi - waisa hi
        System.out.println(compress("zzzzzzzzzzzz")); // 12 baar z -> do digit ki count
    }
}

// Output:
// a3b2c
// abc
// z12
