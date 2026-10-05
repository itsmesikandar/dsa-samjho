import java.util.*;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) {
        String s = "mississippi";

        // 1) int[26] - sirf lowercase letters ke liye, sabse tez
        int[] arr = new int[26];
        for (char c : s.toCharArray()) arr[c - 'a']++;
        System.out.println(arr['s' - 'a']);

        // 2) HashMap - kuch bhi count kar sakte ho (words, numbers, objects)
        Map<Character, Integer> map = new HashMap<>();
        for (char c : s.toCharArray()) map.merge(c, 1, Integer::sum);
        System.out.println(new TreeMap<>(map));

        // 3) Streams one-liner (andar wahi map)
        Map<Character, Long> counts = s.chars()
            .mapToObj(c -> (char) c)
            .collect(Collectors.groupingBy(c -> c, TreeMap::new, Collectors.counting()));
        System.out.println(counts);
    }
}

// Output:
// 4
// {i=4, m=1, p=2, s=4}
// {i=4, m=1, p=2, s=4}
