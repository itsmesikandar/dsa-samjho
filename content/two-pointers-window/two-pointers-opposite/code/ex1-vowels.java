class Main {
    // Sirf vowels ko ulta karo, baaki letters apni jagah
    static String reverseVowels(String s) {
        char[] c = s.toCharArray();
        String vowels = "aeiouAEIOU";
        int l = 0; //@init
        int r = c.length - 1;
        while (l < r) {
            while (l < r && vowels.indexOf(c[l]) < 0) l++; // left se agla vowel dhoondho //@skipL
            while (l < r && vowels.indexOf(c[r]) < 0) r--; // right se agla vowel //@skipR
            char t = c[l]; // dono vowels swap //@swap
            c[l] = c[r];
            c[r] = t;
            l++;
            r--;
        }
        return new String(c); //@done
    }

    public static void main(String[] args) {
        System.out.println(reverseVowels("hello"));
        System.out.println(reverseVowels("chai pakoda"));
    }
}

// Output:
// holle
// chao pakida
