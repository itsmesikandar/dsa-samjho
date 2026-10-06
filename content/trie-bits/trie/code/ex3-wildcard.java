class Main {
    public static void main(String[] args) {
        WordDictionary d = new WordDictionary();
        for (String w : new String[] {"roti", "rota", "ram", "rasta"}) d.addWord(w);
        System.out.println(d.search("r.t."));
        System.out.println(d.search("..m"));
        System.out.println(d.search("r.ti."));
    }
}

class WNode {
    WNode[] next = new WNode[26];
    boolean isEnd = false;
}

// Words daalo; search mein '.' = koi bhi ek akshar
class WordDictionary {
    private final WNode root = new WNode();

    void addWord(String word) {
        WNode cur = root;
        for (char ch : word.toCharArray()) {
            int k = ch - 'a';
            if (cur.next[k] == null) cur.next[k] = new WNode();
            cur = cur.next[k];
        }
        cur.isEnd = true;
    }

    boolean search(String word) {
        return dfs(root, word, 0);
    }

    // i = pattern mein kahan tak, node = trie mein kahan
    private boolean dfs(WNode node, String word, int i) {
        if (i == word.length()) return node.isEnd; // pattern khatam - word bhi yahin khatam hona chahiye //@end
        char ch = word.charAt(i);
        if (ch == '.') { // koi bhi akshar - har bachche mein try karo //@dot
            for (WNode child : node.next) {
                if (child != null && dfs(child, word, i + 1)) return true;
            }
            return false;
        }
        WNode child = node.next[ch - 'a'];
        if (child == null) return false; // is akshar ka raasta hi nahi //@char
        return dfs(child, word, i + 1);
    }
}

// Output:
// true
// true
// false
