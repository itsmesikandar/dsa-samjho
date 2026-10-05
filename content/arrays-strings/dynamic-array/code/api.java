import java.util.*;

class Main {
    public static void main(String[] args) {
        // Pehle se capacity do (100) - baar-baar resize nahi hoga
        List<Integer> list = new ArrayList<>(100);
        list.addAll(List.of(4, 1, 7, 1));

        System.out.println(list.indexOf(1)); // pehla match ka index - O(n)
        System.out.println(list.contains(7)); // poori list dekhni padti hai - O(n)

        list.remove(Integer.valueOf(1)); // VALUE hatani ho to Integer.valueOf! (remove(1) index 1 hatata)
        System.out.println(list);
        list.remove(0); // int diya -> INDEX 0 hatao
        System.out.println(list);

        Collections.sort(list);
        System.out.println(list);

        int[] arr = list.stream().mapToInt(Integer::intValue).toArray(); // List<Integer> -> int[]
        int sum = 0;
        for (int x : arr) sum += x;
        System.out.println(sum);
    }
}

// Output:
// 1
// true
// [4, 7, 1]
// [7, 1]
// [1, 7]
// 8
