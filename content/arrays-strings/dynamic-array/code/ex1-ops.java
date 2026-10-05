import java.util.*;

class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(List.of(3, 7, 9)); //@init
        list.add(5); // end mein daalna: O(1) amortized //@add
        list.add(0, 1); // shuru mein: baaki sab right khiske -> O(n) //@addfront
        list.remove(2); // int index -> beech se hatana: baad wale left khiske -> O(n) //@remove
        list.set(1, 8); // index par update: O(1) //@set
        System.out.println(list);
        System.out.println(list.size());
    }
}

// Output:
// [1, 8, 9, 5]
// 4
