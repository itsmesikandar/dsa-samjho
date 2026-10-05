import java.util.*;

class Main {
    // Words ko pehle letter ke hisaab se group karo. HashMap<Character, List<String>>
    static Map<Character, List<String>> groupByFirst(List<String> words) {
        Map<Character, List<String>> groups = new HashMap<>(); //@init
        for (String w : words) {
            // list nahi hai to nayi banao (computeIfAbsent), phir usme word daalo
            groups.computeIfAbsent(w.charAt(0), k -> new ArrayList<>()).add(w); //@add
        }
        return new TreeMap<>(groups); //@done
    }

    public static void main(String[] args) {
        System.out.println(groupByFirst(List.of("chai", "samosa", "jalebi", "chutney", "jam")));
    }
}

// Output:
// {c=[chai, chutney], j=[jalebi, jam], s=[samosa]}
