import java.util.*;

class Main {
    public static void main(String[] args) {
        List<String> words = List.of("samosa", "chai", "jalebi", "chai", "samosa");

        // LinkedHashSet: duplicates hatao par PEHLI baar wala order rakho
        System.out.println(new LinkedHashSet<>(words));

        // TreeSet: sorted order + "isse just bada/chhota" queries (O(log n))
        TreeSet<Integer> ts = new TreeSet<>(List.of(10, 40, 20, 50));
        System.out.println(ts);
        System.out.println(ts.ceiling(25)); // 25 ya usse bada sabse chhota
        System.out.println(ts.floor(25)); // 25 ya usse chhota sabse bada

        // Unique count
        System.out.println(new HashSet<>(words).size());
    }
}

// Output:
// [samosa, chai, jalebi]
// [10, 20, 40, 50]
// 40
// 20
// 3
