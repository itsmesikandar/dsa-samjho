class Main {
    static int countVowels(String s) {
        int count = 0;
        for (char c : s.toLowerCase().toCharArray()) { // 'A' aur 'a' dono count kiye jaayein
            if ("aeiou".indexOf(c) >= 0) count++; // vowel hai? //@check
        }
        return count; //@done
    }

    public static void main(String[] args) {
        System.out.println(countVowels("Hello World"));
        System.out.println(countVowels("Chai Pe Charcha"));
    }
}

// Output:
// 3
// 5
