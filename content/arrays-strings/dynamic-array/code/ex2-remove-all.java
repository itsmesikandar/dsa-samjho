import java.util.*;

class Main {
    // List se saare x hatao, O(n) mein: rakhne layak items ko aage "likhte" jao
    static void removeAllX(List<Integer> list, int x) {
        int w = 0; // agla item kahan likhna hai //@init
        for (int r = 0; r < list.size(); r++) { // r: padhne wala pointer
            if (list.get(r) != x) { // ye rakhna hai? (int se compare - unboxing, safe) //@check
                list.set(w, list.get(r)); // haan: aage likh do //@keep
                w++;
            }
        }
        while (list.size() > w) list.remove(list.size() - 1); // bacha hua end se hatao (har ek O(1)) //@trim
    }

    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(List.of(3, 2, 2, 3, 4, 2));
        removeAllX(list, 2);
        System.out.println(list);
        // Library wala tareeka bhi O(n) hai:
        List<Integer> other = new ArrayList<>(List.of(3, 2, 2, 3, 4, 2));
        other.removeIf(v -> v == 2);
        System.out.println(other);
    }
}

// Output:
// [3, 3, 4]
// [3, 3, 4]
