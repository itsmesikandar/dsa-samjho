import java.util.*;

class Main {
    // Har character kitni baar aaya? HashMap + getOrDefault
    static Map<Character, Integer> charFrequency(String s) {
        Map<Character, Integer> freq = new HashMap<>(); //@init
        for (char c : s.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1); // nahi hai to 0 maano, phir +1 //@count
        }
        return new TreeMap<>(freq); // HashMap ka order fix nahi hota; print ke liye sorted //@done
    }

    public static void main(String[] args) {
        System.out.println(charFrequency("banana"));
        System.out.println(charFrequency("chai"));
    }
}

// Output:
// {a=3, b=1, n=2}
// {a=1, c=1, h=1, i=1}
