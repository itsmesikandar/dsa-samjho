class Main {
    public static void main(String[] args) {
        CountTrie t = new CountTrie();
        for (String w : new String[] {"chai", "chai", "chawal", "chana"}) t.insert(w);
        System.out.println(t.countWordsEqualTo("chai"));
        System.out.println(t.countWordsStartingWith("cha"));
        t.erase("chai");
        System.out.println(t.countWordsStartingWith("chai"));
    }
}

// Har node par do count: pass = kitne words is prefix se guzre, ends = kitne yahin khatam
class CNode {
    CNode[] next = new CNode[26];
    int pass = 0;
    int ends = 0;
}

class CountTrie {
    private final CNode root = new CNode();

    void insert(String word) {
        CNode cur = root;
        cur.pass++; // khaali prefix "" se har word pass hota hai
        for (char ch : word.toCharArray()) {
            int k = ch - 'a';
            if (cur.next[k] == null) cur.next[k] = new CNode();
            cur = cur.next[k];
            cur.pass++;
        }
        cur.ends++;
    }

    // maan ke chalo word trie mein hai - raaste ki har count ek kam
    void erase(String word) {
        CNode cur = root;
        cur.pass--;
        for (char ch : word.toCharArray()) {
            cur = cur.next[ch - 'a'];
            cur.pass--;
        }
        cur.ends--;
    }

    private CNode find(String s) {
        CNode cur = root;
        for (char ch : s.toCharArray()) {
            cur = cur.next[ch - 'a'];
            if (cur == null) return null;
        }
        return cur;
    }

    int countWordsEqualTo(String word) {
        CNode n = find(word);
        return n == null ? 0 : n.ends;
    }

    int countWordsStartingWith(String prefix) {
        CNode n = find(prefix);
        return n == null ? 0 : n.pass;
    }
}

// Output:
// 2
// 4
// 1
