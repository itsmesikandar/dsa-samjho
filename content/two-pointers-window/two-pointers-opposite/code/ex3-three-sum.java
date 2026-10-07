import java.util.*;

class Main {
    // Saare UNIQUE triplets jinka sum 0 ho
    static List<List<Integer>> threeSum(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a); // sort -> two pointers chal sakte hain, aur duplicates neighbor ban jaate hain //@sort
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < a.length; i++) {
            if (i > 0 && a[i] == a[i - 1]) continue; // same pehla number dobara -> wahi triplets milenge, skip //@skipI
            int l = i + 1, r = a.length - 1;
            while (l < r) {
                int s = a[i] + a[l] + a[r]; //@sum
                if (s < 0) l++; // chhota: badi value chahiye
                else if (s > 0) r--; // bada: chhoti value chahiye
                else {
                    res.add(List.of(a[i], a[l], a[r])); //@found
                    l++;
                    r--;
                    while (l < r && a[l] == a[l - 1]) l++; // same second number skip -> duplicate triplet nahi //@dedupe
                }
            }
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-1, 0, 1, 2, -1, -4}));
        System.out.println(threeSum(new int[]{0, 0, 0, 0}));
    }
}

// Output:
// [[-1, -1, 2], [-1, 0, 1]]
// [[0, 0, 0]]
