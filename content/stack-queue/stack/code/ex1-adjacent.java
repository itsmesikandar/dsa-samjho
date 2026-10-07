class Main {
    // Paas-paas ke do same letters hatao - baar-baar, jab tak koi aisa pair na bache
    static String removeDuplicates(String s) {
        StringBuilder st = new StringBuilder(); // StringBuilder hi stack hai: end = top
        for (char c : s.toCharArray()) {
            int n = st.length();
            if (n > 0 && st.charAt(n - 1) == c) { // top par same letter: dono gaye //@pop
                st.deleteCharAt(n - 1);
            } else {
                st.append(c); //@push
            }
        }
        return st.toString();
    }

    public static void main(String[] args) {
        System.out.println(removeDuplicates("abbaca"));
        System.out.println(removeDuplicates("azxxzy"));
    }
}

// Output:
// ca
// ay
