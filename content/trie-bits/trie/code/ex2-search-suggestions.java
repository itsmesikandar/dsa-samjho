import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // Har typed prefix par max 3 suggestions - lexicographically sabse chhote
    static List<List<String>> suggestedProducts(String[] products, String searchWord) {
        String[] sorted = products.clone();
        Arrays.sort(sorted);
        SNode root = new SNode();
        for (String p : sorted) { // SORTED daalo - har node par pehle aane wale hi chhote //@insert
            SNode cur = root;
            for (char ch : p.toCharArray()) {
                int k = ch - 'a';
                if (cur.next[k] == null) cur.next[k] = new SNode();
                cur = cur.next[k];
                if (cur.top.size() < 3) cur.top.add(p);
            }
        }
        List<List<String>> ans = new ArrayList<>();
        SNode cur = root;
        for (char ch : searchWord.toCharArray()) {
            cur = cur == null ? null : cur.next[ch - 'a']; // raasta toota to aage sab khaali //@type
            ans.add(cur == null ? new ArrayList<>() : cur.top);
        }
        return ans; //@done
    }

    public static void main(String[] args) {
        System.out.println(suggestedProducts(new String[] {"pani", "paneer", "papad", "pakoda", "paratha"}, "pani"));
        System.out.println(suggestedProducts(new String[] {"chai"}, "cx"));
    }
}

class SNode {
    SNode[] next = new SNode[26];
    List<String> top = new ArrayList<>(); // is prefix wale pehle 3 products (sorted order mein daale, to yahi sabse chhote)
}

// Output:
// [[pakoda, paneer, pani], [pakoda, paneer, pani], [paneer, pani], [pani]]
// [[chai], []]
