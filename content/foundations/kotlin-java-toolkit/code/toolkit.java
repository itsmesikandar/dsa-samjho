import java.util.*;

class Main {
    static class Student {
        String name;
        int marks;

        Student(String name, int marks) {
            this.name = name;
            this.marks = marks;
        }
    }

    public static void main(String[] args) {
        // List (dynamic array): size badal sakti hai
        List<Integer> list = new ArrayList<>(List.of(5, 2, 8));
        list.add(1);
        Collections.sort(list);
        System.out.println(list);

        // Comparator: marks zyada wala pehle; marks barabar ho to naam A-Z
        List<Student> students = new ArrayList<>(List.of(new Student("Ravi", 80), new Student("Anu", 92), new Student("Kabir", 80)));
        students.sort(Comparator.comparingInt((Student s) -> s.marks).reversed().thenComparing(s -> s.name));
        List<String> names = new ArrayList<>();
        for (Student s : students) names.add(s.name);
        System.out.println(names);

        // HashSet: duplicate apne aap hat jaate hain
        Set<Integer> seen = new HashSet<>(List.of(3, 1));
        seen.add(3);
        System.out.println(seen.size());

        // HashMap: getOrDefault se count
        Map<String, Integer> count = new HashMap<>();
        for (String w : List.of("chai", "samosa", "chai")) count.put(w, count.getOrDefault(w, 0) + 1);
        System.out.println(count.get("chai"));

        // Char ka hisaab: 'a' -> 0, 'b' -> 1 ... (array index ke liye bahut kaam ka)
        StringBuilder sb = new StringBuilder();
        for (char c : "abc".toCharArray()) sb.append(c - 'a');
        System.out.println(sb);
        System.out.println((char) ('a' + 2)); // c

        // int ki limit aur long
        System.out.println((long) Integer.MAX_VALUE + 1);
    }
}

// Output:
// [1, 2, 5, 8]
// [Anu, Kabir, Ravi]
// 2
// 2
// 012
// c
// 2147483648
