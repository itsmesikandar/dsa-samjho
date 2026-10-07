import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        String s = "chai, samosa, jalebi";
        System.out.println(s.length()); // characters ki count
        System.out.println(s.charAt(0)); // index se char - O(1)
        System.out.println(s.substring(6, 12)); // [6, 12) - NAYI string banti hai, O(k)
        System.out.println(s.indexOf("jalebi")); // pehla match - O(n * m) tak
        System.out.println(Arrays.toString(s.split(", "))); // pieces

        char[] chars = "dcba".toCharArray(); // String -> char[] (badal sakte ho)
        Arrays.sort(chars);
        System.out.println(new String(chars)); // char[] -> String

        System.out.println((int) 'a'); // character ka number (Unicode/ASCII)
        System.out.println("Chai".equalsIgnoreCase("chai"));
        System.out.println("ab".repeat(3));
    }
}

// Output:
// 20
// c
// samosa
// 14
// [chai, samosa, jalebi]
// abcd
// 97
// true
// ababab
