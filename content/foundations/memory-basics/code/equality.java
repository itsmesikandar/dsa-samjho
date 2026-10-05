import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] a = {1, 2};
        int[] b = {1, 2}; // same values, par heap par ALAG object
        int[] c = a; // naya object nahi, sirf a ka address copy

        System.out.println(a == b); // Java ka == objects par "same object?" check karta hai -> nahi
        System.out.println(a == c); // c aur a ek hi object -> haan
        System.out.println(Arrays.equals(a, b)); // andar ke values same? -> haan

        String s1 = "chai";
        String s2 = new StringBuilder("ch").append("ai").toString(); // runtime pe bana naya String object
        System.out.println(s1.equals(s2)); // values compare karne ke liye equals()
        System.out.println(s1 == s2); // alag objects
    }
}

// Output:
// false
// true
// true
// true
// false
