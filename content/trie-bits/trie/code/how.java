class Main {
    public static void main(String[] args) {
        Trie t = new Trie();
        for (String w : new String[] {"app", "apple", "apt", "bat"}) t.insert(w);
        System.out.println(t.search("ap"));
        System.out.println(t.startsWith("ap"));
        System.out.println(t.search("app"));
    }
}

// Trie: har node = ek prefix. 26 bachche (a-z) aur ek flag - kya koi word yahin khatam hota hai?
class TrieNode {
    TrieNode[] next = new TrieNode[26];
    boolean isEnd = false;
}

class Trie {
    private final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode cur = root;
        for (char ch : word.toCharArray()) {
            int k = ch - 'a';
            if (cur.next[k] == null) cur.next[k] = new TrieNode(); // ye prefix pehli baar - naya node //@create
            cur = cur.next[k];
        }
        cur.isEnd = true; // poora word yahan khatam //@end
    }

    // s ke saare letters ka raasta - mila to aakhri node, warna null
    private TrieNode walk(String s) {
        TrieNode cur = root;
        for (char ch : s.toCharArray()) {
            cur = cur.next[ch - 'a'];
            if (cur == null) return null; // raasta toota - aisa prefix hai hi nahi //@step
        }
        return cur;
    }

    boolean search(String word) {
        TrieNode n = walk(word);
        return n != null && n.isEnd; // raasta bhi ho AUR word wahin khatam //@search
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null; // sirf raasta kaafi //@prefix
    }
}

// Output:
// false
// true
// true
