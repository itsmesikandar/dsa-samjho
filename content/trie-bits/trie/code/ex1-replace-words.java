import java.util.ArrayList;
import java.util.List;

class Main {
    // Har word ko uske SABSE CHHOTE root se badlo (agar koi root uska prefix ho)
    static String replaceWords(List<String> roots, String sentence) {
        Node root = new Node();
        for (String r : roots) { // saare roots trie mein
            Node cur = root;
            for (char ch : r.toCharArray()) {
                int k = ch - 'a';
                if (cur.next[k] == null) cur.next[k] = new Node();
                cur = cur.next[k];
            }
            cur.isEnd = true;
        }
        List<String> out = new ArrayList<>();
        for (String word : sentence.split(" ")) {
            Node cur = root;
            String res = word; // koi root na mila to word waisa hi
            for (int i = 0; i < word.length(); i++) {
                cur = cur.next[word.charAt(i) - 'a'];
                if (cur == null) break; // raasta toota - koi root iska prefix nahi //@walk
                if (cur.isEnd) { // pehla hi root = sabse chhota, yahin ruko //@root
                    res = word.substring(0, i + 1);
                    break;
                }
            }
            out.add(res);
        }
        return String.join(" ", out);
    }

    public static void main(String[] args) {
        System.out.println(replaceWords(List.of("chai", "pan", "dal"), "chaiwala pani daliya"));
        System.out.println(replaceWords(List.of("a", "ab"), "abc xyz"));
    }
}

class Node {
    Node[] next = new Node[26];
    boolean isEnd = false;
}

// Output:
// chai pan dal
// a xyz
