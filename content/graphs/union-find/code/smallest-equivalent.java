class Main {
    // s1[i] aur s2[i] barabar maane jaate hain. Har group ka leader = sabse chhota letter
    static int find(int[] parent, int x) {
        if (parent[x] != x) parent[x] = find(parent, parent[x]);
        return parent[x];
    }

    static String smallestEquivalent(String s1, String s2, String base) {
        int[] parent = new int[26]; // 26 letters, har ek apna group
        for (int i = 0; i < 26; i++) parent[i] = i;
        for (int i = 0; i < s1.length(); i++) {
            int a = find(parent, s1.charAt(i) - 'a');
            int b = find(parent, s2.charAt(i) - 'a');
            if (a < b) parent[b] = a; else parent[a] = b; // chhota letter hi leader bane
        }
        StringBuilder sb = new StringBuilder();
        for (char ch : base.toCharArray()) sb.append((char) ('a' + find(parent, ch - 'a')));
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(smallestEquivalent("abc", "cde", "eed"));
        System.out.println(smallestEquivalent("hello", "world", "hold"));
    }
}

// Output:
// aab
// hdld
