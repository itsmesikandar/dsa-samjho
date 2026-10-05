import java.util.*;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> marks = new HashMap<>(Map.of("Ravi", 72, "Anu", 91, "Kabir", 85));

        // HashMap ka order fixed nahi - fixed order chahiye to sorted map par loop
        for (Map.Entry<String, Integer> e : new TreeMap<>(marks).entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }

        // sabse zyada marks kiske?
        String top = Collections.max(marks.entrySet(), Map.Entry.comparingByValue()).getKey();
        System.out.println(top);

        // merge: key hai to purani value ke saath jodo, nahi hai to nayi daalo
        marks.merge("Ravi", 5, Integer::sum);
        System.out.println(marks.get("Ravi"));
    }
}

// Output:
// Anu: 91
// Kabir: 85
// Ravi: 72
// Anu
// 77
