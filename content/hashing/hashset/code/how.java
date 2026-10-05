import java.util.*;

class Main {
    public static void main(String[] args) {
        Set<Integer> a = new HashSet<>(List.of(1, 2, 3, 4));
        Set<Integer> b = new HashSet<>(List.of(3, 4, 5));
        System.out.println(a.add(2)); // 2 pehle se hai -> add() false deta hai, kuch nahi badla //@add
        System.out.println(a.contains(3)); // contains: O(1) average //@contains

        Set<Integer> common = new TreeSet<>(a); // TreeSet: print sorted aaye
        common.retainAll(b); // dono mein common //@intersect
        System.out.println(common);

        Set<Integer> all = new TreeSet<>(a);
        all.addAll(b); // dono ke saare (bina duplicate) //@union
        System.out.println(all);

        Set<Integer> onlyA = new TreeSet<>(a);
        onlyA.removeAll(b); // sirf a mein, b mein nahi //@minus
        System.out.println(onlyA);
    }
}

// Output:
// false
// true
// [3, 4]
// [1, 2, 3, 4, 5]
// [1, 2]
