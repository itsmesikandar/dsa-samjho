import java.util.*;

class Main {
    // Anagrams ko ek group mein rakho. Key = letters sort karke (anagrams ka sorted form same hota hai)
    static List<List<String>> groupAnagrams(List<String> words) {
        Map<String, List<String>> groups = new HashMap<>(); //@init
        for (String w : words) {
            char[] cs = w.toCharArray();
            Arrays.sort(cs);
            String key = new String(cs); // "eat" -> "aet", "tea" -> "aet" //@key
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w); //@add
        }
        // print ke liye order fix: har group sorted, groups apne pehle word se sorted
        List<List<String>> res = new ArrayList<>(); //@done
        for (List<String> g : groups.values()) {
            List<String> copy = new ArrayList<>(g);
            Collections.sort(copy);
            res.add(copy);
        }
        res.sort(Comparator.comparing(g -> g.get(0)));
        return res;
    }

    public static void main(String[] args) {
        System.out.println(groupAnagrams(List.of("eat", "tea", "tan", "ate", "nat", "bat")));
    }
}

// Output:
// [[ate, eat, tea], [bat], [nat, tan]]
