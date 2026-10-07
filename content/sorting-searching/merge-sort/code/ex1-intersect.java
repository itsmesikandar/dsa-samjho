import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    // 2 arrays ka common hissa - jo number dono mein jitni baar (kam se kam) aaye, utni baar
    static int[] intersect(int[] a, int[] b) {
        Arrays.sort(a); // dono sort -> ab merge ki tarah saath-saath chal sakte hain //@sort
        Arrays.sort(b);
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        while (i < a.length && j < b.length) {
            if (a[i] < b[j]) i++; // a[i] b mein aage kabhi nahi milega (b ab bada hi hoga) //@lt
            else if (a[i] > b[j]) j++; //@gt
            else { // barabar: dono mein hai //@eq
                res.add(a[i]);
                i++;
                j++;
            }
        }
        int[] out = new int[res.size()];
        for (int p = 0; p < out.length; p++) out[p] = res.get(p);
        return out;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(intersect(new int[]{4, 9, 5}, new int[]{9, 4, 9, 8, 4})));
        System.out.println(Arrays.toString(intersect(new int[]{1, 2, 2, 1}, new int[]{2, 2})));
    }
}

// Output:
// [4, 9]
// [2, 2]
