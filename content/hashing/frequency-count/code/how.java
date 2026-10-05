class Main {
    // Har lowercase letter kitni baar aaya? int[26]: index = c - 'a'
    static int[] letterCounts(String s) {
        int[] count = new int[26]; // a..z ke liye 26 dabbe, sab 0 //@init
        for (char c : s.toCharArray()) {
            count[c - 'a']++; // 'a' -> 0, 'b' -> 1 ... seedha index, koi hashing nahi //@count
        }
        return count; //@done
    }

    public static void main(String[] args) {
        int[] count = letterCounts("banana");
        // sirf jo letters aaye unhe print karo: letter + count
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            if (count[i] == 0) continue;
            if (sb.length() > 0) sb.append(' ');
            sb.append((char) ('a' + i)).append(count[i]);
        }
        System.out.println(sb);
    }
}

// Output:
// a3 b1 n2
