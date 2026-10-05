import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Main {
    // Kam baar aane wale numbers pehle; frequency barabar ho to bada number pehle
    static int[] frequencySort(int[] nums) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum); //@count
        Integer[] boxed = Arrays.stream(nums).boxed().toArray(Integer[]::new);
        // pehli key: frequency (chhoti pehle), doosri key: value (badi pehle)
        Arrays.sort(boxed, (a, b) -> { //@sort
            int fa = freq.get(a), fb = freq.get(b);
            return fa != fb ? Integer.compare(fa, fb) : Integer.compare(b, a);
        });
        return Arrays.stream(boxed).mapToInt(Integer::intValue).toArray();
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(frequencySort(new int[]{2, 3, 1, 3, 2})));
        System.out.println(Arrays.toString(frequencySort(new int[]{1, 1, 2, 2, 2, 3})));
    }
}

// Output:
// [1, 3, 3, 2, 2]
// [3, 1, 1, 2, 2, 2]
