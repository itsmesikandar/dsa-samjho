import java.util.*;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> phone = new HashMap<>(); // naam -> number //@init
        phone.put("Ravi", 98100); // put: nayi key //@put
        phone.put("Anu", 99200);
        phone.put("Ravi", 98111); // same key dobara -> purani value REPLACE //@update
        System.out.println(phone.get("Anu")); // get: O(1) average //@get
        System.out.println(phone.getOrDefault("Kabir", -1)); // key nahi hai -> default value //@default
        System.out.println(phone.containsKey("Ravi")); // containsKey //@contains
        phone.remove("Anu"); //@remove
        System.out.println(phone.size());
    }
}

// Output:
// 99200
// -1
// true
// 1
