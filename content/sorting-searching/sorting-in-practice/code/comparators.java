import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

class Main {
    record Person(String name, int age) {}

    public static void main(String[] args) {
        List<Person> people = new ArrayList<>(List.of(new Person("Ravi", 25), new Person("Anu", 30), new Person("Zoya", 25), new Person("Babu", 30)));
        // age ulta (bade pehle); age barabar ho to naam A-Z
        people.sort(Comparator.comparingInt(Person::age).reversed().thenComparing(Person::name));
        List<String> parts = new ArrayList<>();
        for (Person p : people) parts.add(p.name() + "(" + p.age() + ")");
        System.out.println(String.join(", ", parts));

        int[] nums = {5, 2, 9, 1};
        Arrays.sort(nums); // in-place; int[] par dual-pivot quicksort
        System.out.println(Arrays.toString(nums));
        Integer[] boxed = {5, 2, 9, 1}; // int[] par reverseOrder nahi chalta - Integer[] chahiye
        Arrays.sort(boxed, Collections.reverseOrder());
        System.out.println(Arrays.toString(boxed));
    }
}

// Output:
// Anu(30), Babu(30), Ravi(25), Zoya(25)
// [1, 2, 5, 9]
// [9, 5, 2, 1]
