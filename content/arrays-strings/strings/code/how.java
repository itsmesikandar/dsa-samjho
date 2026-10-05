class Main {
    // GALAT tareeka: += har baar POORI nayi String banata hai -> 1 + 2 + ... + n copies = O(n^2)
    static String buildWithPlus(int n) {
        String s = "";
        for (int i = 0; i < n; i++) s += (char) ('a' + i); //@plus
        return s;
    }

    // SAHI tareeka: StringBuilder ek hi buffer mein jodta rehta hai -> O(n)
    static String buildWithBuilder(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append((char) ('a' + i)); // buffer ke end mein, copy nahi //@append
        return sb.toString(); // aakhir mein ek baar String banao //@done
    }

    public static void main(String[] args) {
        System.out.println(buildWithBuilder(5));
        System.out.println(buildWithPlus(5)); // answer same, par bade n par bahut slow
    }
}

// Output:
// abcde
// abcde
