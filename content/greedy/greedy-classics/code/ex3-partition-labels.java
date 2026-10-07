import java.util.ArrayList;
import java.util.List;

class Main {
    // Har letter sirf ek pieces mein: piece tab tak khiincho jab tak andar ke saare letters ka AAKHRI index na aa jaaye
    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i; // har letter aakhri baar kahan //@last
        List<Integer> sizes = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']); // ye letter hai to piece kam se kam yahan tak //@extend
            if (i == end) { // pieces ke saare letters ka aakhri aa gaya - yahin kaato //@cut
                sizes.add(end - start + 1);
                start = i + 1;
            }
        }
        return sizes;
    }

    public static void main(String[] args) {
        System.out.println(partitionLabels("abacdcdeffe"));
        System.out.println(partitionLabels("zz"));
        System.out.println(partitionLabels("abc"));
    }
}

// Output:
// [3, 4, 4]
// [2]
// [1, 1, 1]
